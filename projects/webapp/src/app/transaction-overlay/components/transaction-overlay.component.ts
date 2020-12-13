import {
  animate,
  AnimationEvent,
  state as animationState,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog, MatSelect } from '@angular/material';
import {
  Category,
  Group,
  Member,
  Transaction,
  TransactionLine
} from '@app/models';
import { CategoriesService, TransactionsService } from '@app/services';
import { MembersService } from '@app/services/members.service';
import { BaseComponent, CreateMemberDialogComponent } from '@app/shared';
import { TRANSACTION_DIALOG_DATA } from '@app/transaction-overlay/transaction-overlay.tokens';
import { TransactionOverlayRef } from '@app/transaction-overlay/transactionOverlayRef';
import { markFormAsTouched, orderMembers } from '@app/utils/helpers';
import { TdLoadingService } from '@covalent/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { CategoryDialogComponent } from './../../shared/category-dialog/category-dialog.component';

@Component({
  selector: 'app-transaction-overlay',
  templateUrl: './transaction-overlay.component.html',
  styleUrls: ['./transaction-overlay.component.scss'],
  animations: [
    trigger('slideDown', [
      animationState('void', style({ transform: 'translateY(-100%)' })),
      animationState('enter', style({ transform: 'translateY(0)' })),
      animationState('leave', style({ transform: 'translateY(-100%)' })),
      transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
    ])
  ]
})
export class TransactionOverlayComponent extends BaseComponent
  implements OnInit, OnDestroy {
  // Apply animation to the host element
  @HostBinding('@slideDown') slideDown = 'enter';
  animationState: 'void' | 'enter' | 'leave' = 'enter';
  animationStateChanged = new EventEmitter<AnimationEvent>();
  @ViewChildren(MatSelect) selectsComponent: QueryList<MatSelect>;

  transactionForm: FormGroup;
  selectedRowIndex: number;
  currentGroup: Group;
  categories: Category[];

  members: Member[] = [];
  total = 0;
  interestAmount = 0;
  balanceDue = 0;
  title: string;
  minDate: Date;

  constructor(
    private fb: FormBuilder,
    private membersService: MembersService,
    private categoriesService: CategoriesService,
    private transactionsService: TransactionsService,
    public dialogRef: TransactionOverlayRef,
    private translateService: TranslateService,
    @Inject(TRANSACTION_DIALOG_DATA) public transaction: Transaction,
    private loadingService: TdLoadingService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    $crisp.push(['do', 'chat:hide']);

    this.calculate(this.transaction);
    //this.total = this.transaction.total || 0;

    this.translateService
      .get(`app.transactions.${this.transaction.direction}Transactions`)
      .subscribe(translation => {
        this.title = translation;
      });

    this.transactionForm = this.fb.group({
      type: [
        this.transaction && this.transaction.type
          ? this.transaction.type
          : 'payment',
        Validators.required
      ],
      direction: [
        this.transaction && this.transaction.direction
          ? this.transaction.direction
          : 'input',
        Validators.required
      ],
      date: [
        this.transaction && this.transaction.date
          ? this.transaction.date
          : null,
        Validators.required
      ],
      dueDate:
        this.transaction && this.transaction.dueDate
          ? this.transaction.dueDate
          : '',
      memberId: [
        this.transaction ? this.transaction.memberId : '',
        Validators.required
      ],
      interest: [this.transaction ? this.transaction.interest : null],
      interestType: [
        this.transaction && this.transaction.interestType
          ? this.transaction.interestType
          : 'percent'
      ],
      lines:
        this.transaction && this.transaction.lines
          ? this.buildLines(this.transaction.lines)
          : this.fb.array([
              this.fb.group({
                categoryId: ['', Validators.required],
                amount: ['', Validators.required],
                description: ''
              })
            ])
    });

    this.transactionForm.valueChanges.subscribe((transaction: Transaction) => {
      this.calculate(transaction);
      if (transaction.type === 'payment') {
        if (this.transactionForm.get('interest').enabled) {
          this.transactionForm.get('interest').disable();
        }
        if (this.transactionForm.get('interestType').enabled) {
          this.transactionForm.get('interestType').disable();
        }
      } else {
        if (this.transactionForm.get('interest').disabled) {
          this.transactionForm.get('interest').enable();
        }
        if (this.transactionForm.get('interestType').disabled) {
          this.transactionForm.get('interestType').enable();
        }
      }
    });

    this.currentGroup$
      .pipe(
        tap(group => {
          this.minDate = group.startDate.toDate();
        }),
        switchMap(group =>
          combineLatest(
            this.membersService.getMembers(group.id),
            this.categoriesService.getCategories(group.id)
          )
        ),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(([members, categories]) => {
        this.members = orderMembers(members);
        this.categories = categories;
      });
  }

  close() {
    this.slideDown = 'leave';
    setTimeout(() => {
      this.dialogRef.close();
    }, 400);
  }

  get linesControl(): FormArray {
    return this.transactionForm.get('lines') as FormArray;
  }

  get memberControl(): AbstractControl {
    return this.transactionForm.get('memberId');
  }

  buildLines(lines: TransactionLine[]) {
    const formGroupArray = lines.map(line => {
      return this.fb.group({
        categoryId: line.categoryId,
        amount: line.amount,
        description: line.description
      });
    });
    return this.fb.array(formGroupArray);
  }

  removeLine(index: number) {
    if (index > 0) {
      this.linesControl.removeAt(index);
    }
  }

  addLine() {
    this.linesControl.push(
      this.fb.group({
        categoryId: '',
        amount: '',
        description: ''
      })
    );
  }

  addMember() {
    const dialogRef = this.dialog.open(CreateMemberDialogComponent);

    dialogRef.afterClosed().subscribe(memberId => {
      if (memberId) {
        this.memberControl.setValue(memberId);
      }
      this.closeAllSelectComponent();
    });
  }

  addCategory(index) {
    const dialogRef = this.dialog.open(CategoryDialogComponent);

    dialogRef.afterClosed().subscribe(categoryId => {
      if (categoryId) {
        const line: AbstractControl = this.linesControl.controls[index];
        line.get('categoryId').setValue(categoryId);
      }
      this.closeAllSelectComponent();
    });
  }

  closeAllSelectComponent() {
    for (const selectComponent of this.selectsComponent.toArray()) {
      selectComponent.close();
    }
  }
  async save() {
    markFormAsTouched(this.transactionForm);
    if (this.transactionForm.valid) {
      this.loadingService.register('actions');
      const transaction: Transaction = {
        ...this.transactionForm.value,
        total: this.total
      };

      const categoriesId = {};
      transaction.lines.forEach(line => {
        categoriesId[line.categoryId] = true;
      });

      transaction.categories = categoriesId;

      if (this.transaction.id) {
        //if (this.transactionForm.dirty) {
        await this.transactionsService.updateTransaction(
          this.currentGroup.id,
          this.transaction.id,
          transaction
        );
        // }
      } else {
        if (transaction.type === 'loan') {
          transaction.status = 'unpaid';
        }
        await this.transactionsService.create(
          this.currentGroup.id,
          transaction
        );
      }
      this.dialogRef.close();
    }
  }

  isLate(date: Date) {
    return date.getMilliseconds() < Date.now();
  }

  calculate(transaction: Transaction) {
    if (transaction.lines) {
      this.total =
        transaction.lines.map(l => l.amount).reduce((a, b) => a + b) || 0;
    }

    if (transaction.interest) {
      if (transaction.interestType === 'percent') {
        this.interestAmount = this.total * transaction.interest / 100;
      } else {
        this.interestAmount = transaction.interest;
      }
    }

    this.balanceDue = this.total + this.interestAmount || 0;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    $crisp.push(['do', 'chat:show']);
  }
}
