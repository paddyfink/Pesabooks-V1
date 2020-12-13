import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material';
import { Category, Member } from '@app/models';
import { CategoriesService, MembersService } from '@app/services';
import { BaseComponent } from '@app/shared';
import { TransactionState } from '@app/transactions';
import {
  FormattedDate,
  generateMonthsList,
  orderMembers
} from '@app/utils/helpers';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { Select, Store } from '@ngxs/store';
import { find, get } from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.scss']
})
export class TransactionFilterComponent extends BaseComponent
  implements OnInit {
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;
  @Select(TransactionState.isFiltered) isFiltered$: Observable<boolean>;
  filterForm: FormGroup;
  members: Member[];
  categories: Category[];
  filter: any;
  months: FormattedDate[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private membersService: MembersService,
    private categoriesService: CategoriesService,
    private store: Store
  ) {
    super();
  }

  clearField(field) {
    this.filterForm.get(field).reset();
    this.apply();
  }

  clearAll() {
    this.filterForm.reset();
    this.apply();
  }

  apply() {
    this.store.dispatch(
      new UpdateFormValue({
        value: this.filterForm.value,
        path: 'transactions.filter'
      })
    );
    this.menuTrigger.closeMenu();
  }

  getMemberName(id) {
    const member: Member = find(this.members, { id: id });
    if (member) {
      return `${member.firstName} ${member.lastName}`;
    } else {
      return null;
    }
  }

  getCateogryName(id) {
    return get(find(this.categories, { id: id }), 'name');
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      memberId: '',
      categoryId: '',
      direction: '',
      type: '',
      month: ''
    });

    this.currentGroup$
      .pipe(
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

        this.months = generateMonthsList(this.currentGroup);
        // this.filterForm.get('month').setValue(this.months[0]);
      });

    this.store
      .select(state => TransactionState.getFilter(state))
      .subscribe(filter => {
        this.filter = {
          ...filter,
          member: find(this.members, { id: filter.memberId }),
          category: find(this.categories, { id: filter.categoryId })
        };
        this.filterForm.setValue({
          memberId: filter.memberId || '',
          categoryId: filter.categoryId || '',
          direction: filter.direction || '',
          type: filter.type || '',
          month: filter.month
            ? find(this.months, { name: filter.month.name }) || ''
            : ''
        });
      });
  }
}
