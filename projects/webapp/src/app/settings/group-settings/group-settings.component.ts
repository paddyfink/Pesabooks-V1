import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrenciesService, GroupsService } from '@app/services';
import { BaseComponent } from '@app/shared';
import { TdMessageComponent } from '@covalent/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.scss']
})
export class GroupSettingsComponent extends BaseComponent implements OnInit {
  @ViewChild(TdMessageComponent) messageComponent: TdMessageComponent;
  formGroup: FormGroup;
  dialogTitle: string;
  errorMessage: string;
  currencies$: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupsService,
    private currenciesService: CurrenciesService
  ) {
    super();
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

  async save() {
    try {
      await this.groupService.updateGroup(
        this.currentGroup.id,
        this.formGroup.value
      );
    } catch (e) {
      this.errorMessage = e.message;
      this.messageComponent.open();
    }
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      currency: [null, [Validators.required]],
      description: '',
      startDate: null,
      openingBalance: null
    });

    this.currentGroup$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(group => {
      this.formGroup = this.fb.group({
        name: [group.name, [Validators.required]],
        currency: [group.currency, [Validators.required]],
        description: group.description,
        startDate: group.startDate.toDate(),
        openingBalance: group.openingBalance
      });
    });

    this.currencies$ = this.currenciesService.getCurrencies();
  }
}
