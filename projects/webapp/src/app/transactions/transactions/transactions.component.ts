import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Category, Member, Transaction, TransactionLine } from '@app/models';
import {
  CategoriesService,
  MembersService,
  NavigationService,
  TransactionsService
} from '@app/services';
import { BaseComponent } from '@app/shared';
import { TransactionOverlayService } from '@app/transaction-overlay/services/transaction-overlay.service';
import { calculateTransactionBalanceDue } from '@app/utils/helpers';
import { TdDialogService } from '@covalent/core';
import { Store } from '@ngxs/store';
import { find as _find, get as _get, omit as _omit } from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { first, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { TransactionState } from './../state/transactions.state';
import { TransactionCopyDialogComponent } from './../transaction-copy-dialog/transaction-copy-dialog.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent extends BaseComponent implements OnInit {
  transactions$: Observable<Transaction[]>;
  totalTransaction: {
    inputPayments?: number;
    inputLoans?: number;
    outputLoans?: number;
    outputPayments?: number;
  } = {};
  loading = false;
  totalReceived = 0;
  totalSent = 0;

  constructor(
    public dialog: MatDialog,
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private membersService: MembersService,
    private transactionDialog: TransactionOverlayService,
    private store: Store,
    private dialogService: TdDialogService,
    private navigationService: NavigationService
  ) {
    super();
  }

  ngOnInit() {
    this.navigationService.setPageTitle('app.common.transactions');
    this.transactions$ = this.currentGroup$.pipe(
      tap(() => {
        this.loading = true;
      }),
      switchMap(group =>
        combineLatest(
          this.categoriesService.getCategories(group.id).pipe(first()),
          this.membersService.getMembers(group.id).pipe(first()),
          this.store.select(state => TransactionState.getFilter(state))
        )
      ),
      switchMap(([categories, members, filters]) =>
        this.transactionsService
          .getTransactions(this.currentGroup.id, filters)
          .pipe(
            map(transactions =>
              this.formatTransactions(transactions, members, categories)
            ),
            tap(() => {
              this.loading = false;
            })
          )
      ),
      takeUntil(this.ngUnsubscribe)
    );
  }

  formatTransactions(
    transactions: Transaction[],
    members: Member[],
    categories: Category[]
  ) {
    let accTotalInput = 0;
    let accOutputTotal = 0;

    const transformedTransactions = transactions.map((t: Transaction) => {
      if (t.direction === 'input') {
        accTotalInput += t.total;
      } else {
        accOutputTotal += t.total;
      }

      const member: Member = _find(members, { id: t.memberId });
      return <Transaction>{
        ...t,
        date: t.date ? t.date.toDate() : null,
        dueDate: t.dueDate ? t.dueDate.toDate() : null,
        lines: t.lines.map((line: TransactionLine) => {
          return {
            ...line,
            categoryName: _get(
              _find(categories, { id: line.categoryId }),
              'name'
            )
          };
        }),
        memberFullName: member ? member.fullName : '',
        balanceDue: calculateTransactionBalanceDue(t)
      };
    });
    this.totalReceived = accTotalInput;
    this.totalSent = accOutputTotal;

    return transformedTransactions;
  }

  openTransactionModal(transaction) {
    this.transactionDialog.open({ transaction: transaction });
  }

  duplicate(transaction) {
    this.transactionDialog.open({
      transaction: { ...transaction, id: null }
    });
  }

  deleteTransaction(transaction) {
    this.dialogService
      .openConfirm({
        message: `Delete transaction`,
        title: 'Confirm',
        cancelButton: 'Cancel',
        acceptButton: 'Delete'
      })
      .afterClosed()
      .subscribe((accept: boolean) => {
        if (accept) {
          this.transactionsService.deleteTransaction(
            this.currentGroup.id,
            transaction.id
          );
        }
      });
  }

  deleteManyTransactions(transactions: Transaction[]) {
    this.dialogService
      .openConfirm({
        message: `Delete selected transactions`,
        title: 'Confirm',
        cancelButton: 'Cancel',
        acceptButton: 'Delete'
      })
      .afterClosed()
      .subscribe((accept: boolean) => {
        if (accept) {
          transactions.forEach(transaction => {
            this.transactionsService.deleteTransaction(
              this.currentGroup.id,
              transaction.id
            );
          });
        }
      });
  }
  // saveTemplate(transaction:Transaction){
  //   this.dialogService
  //     .openPrompt({
  //       message: '',

  //       title: 'New Template',
  //       value: `${transaction.memberFullName}`, //OPTIONAL
  //       cancelButton: 'Cancel',
  //       acceptButton: 'Ok',
  //       width: '400px'
  //     })
  //     .afterClosed()
  //     .subscribe((newValue: string) => {
  //       if (newValue) {
  //         this.categoryService.create(this.currentGroup.id, <Category>{
  //           name: newValue
  //         });
  //       } else {
  //         // DO SOMETHING ELSE
  //       }
  //     });
  // }

  markAsPaid(transaction: Transaction) {
    this.transactionsService.updateTransaction(
      this.currentGroup.id,
      transaction.id,
      { status: 'paid' }
    );
  }

  markAsUnpaid(transaction: Transaction) {
    this.transactionsService.updateTransaction(
      this.currentGroup.id,
      transaction.id,
      { status: 'unpaid' }
    );
  }

  copyTransactionsToOtherDate(transactions: Transaction[]) {
    const ref = this.dialog.open(TransactionCopyDialogComponent);
    ref.afterClosed().subscribe(result => {
      if (result) {
        const { date, dueDate } = result;
        transactions.forEach(transaction => {
          const newTransaction = _omit(transaction, ['id', 'memberFullName']);
          this.transactionsService.create(this.currentGroup.id, {
            ...newTransaction,
            date: date,
            dueDate: dueDate
          });
        });
      }
    });
  }
}
