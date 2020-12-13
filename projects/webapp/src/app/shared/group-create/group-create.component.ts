import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CurrenciesService, GroupsService } from '@app/services';
import { TdLoadingService, TdMessageComponent } from '@covalent/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.scss']
})
export class GroupCreateDialogComponent extends BaseComponent
  implements OnInit {
  @ViewChild(TdMessageComponent) messageComponent: TdMessageComponent;
  formGroup: FormGroup;
  dialogTitle: string;
  errorMessage: string;
  canClose = true;
  currencies$: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private currenciesService: CurrenciesService,
    private groupService: GroupsService,
    private loadingService: TdLoadingService,
    public dialogRef: MatDialogRef<GroupCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();
    dialogRef.disableClose = true;
    this.canClose = data.canClose;
  }

  ngOnInit() {
    this.currentUser$.pipe(takeUntil(this.ngUnsubscribe)).subscribe();

    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      openingBalance: [0, [Validators.required]],
      currency: [null, [Validators.required]],
      description: ''
    });

    this.currencies$ = this.currenciesService.getCurrencies();
  }

  get nameControl() {
    return this.formGroup.get('name');
  }

  get currencyControl() {
    return this.formGroup.get('currency');
  }

  get descriptionControl() {
    return this.formGroup.get('description');
  }

  async create() {
    this.loadingService.register('creating');
    try {
      await this.groupService.createGroup(
        this.currentUser,
        this.formGroup.value
      );

      this.dialogRef.close();
    } catch (e) {
      this.errorMessage = e.message;
      this.messageComponent.open();
      this.loadingService.resolve('creating');
    }
  }
}
