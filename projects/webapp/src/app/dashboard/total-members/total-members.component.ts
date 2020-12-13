import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Aggregation, Member } from '@app/models';
import {
  AggregationService,
  CategoriesService,
  MembersService
} from '@app/services';
import { BaseComponent } from '@app/shared';
import { generateMonthsList } from '@app/utils/helpers';
import { ITdDataTableColumn } from '@covalent/core';
import * as _ from 'lodash';
import { combineLatest } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-total-members',
  templateUrl: './total-members.component.html',
  styleUrls: ['./total-members.component.scss']
})
export class TotalMembersComponent extends BaseComponent implements OnInit {
  configWidthColumns: ITdDataTableColumn[] = [];
  membersData = [];
  months = [];
  monthControl = new FormControl('');

  constructor(
    private categoriesService: CategoriesService,
    private membersService: MembersService,
    private aggregationService: AggregationService
  ) {
    super();
  }

  async ngOnInit() {
    this.currentGroup$
      .pipe(
        switchMap(group =>
          combineLatest(
            this.categoriesService.getCategories(group.id),
            this.membersService.getMembers(group.id)
          )
        ),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(([categories, members]) => {
        this.months = generateMonthsList(this.currentGroup);

        this.configWidthColumns = [];
        this.membersData = [];

        categories.forEach(category => {
          this.configWidthColumns.push({
            name: category.id,
            label: category.name,
            numeric: true
          });
        });

        this.membersData = members.map(m => this.getAll(m.aggregation, m));
        this.calculTotal();

        this.monthControl.valueChanges.subscribe(monthObj => {
          if (monthObj) {
            this.aggregationService
              .getTransactionsPerMonthPerMember(this.currentGroup.id, q =>
                q
                  .where('dateMonth', '==', monthObj.month)
                  .where('dateYear', '==', monthObj.year)
              )
              .subscribe(aggs => {
                this.membersData = _.orderBy(
                  aggs.map(agg =>
                    this.getAll(agg, _.find(members, { id: agg.memberId }))
                  ),
                  ['fullName']
                );

                this.calculTotal();
              });
          } else {
            this.membersData = members.map(m => this.getAll(m.aggregation, m));
            this.calculTotal();
          }
        });
      });
  }
  calculTotal() {
    const total = {
      fullName: ''
    };

    for (const data of this.membersData) {
      for (const key in data) {
        if (key !== 'fullName' && data.hasOwnProperty(key)) {
          const value = data[key];
          const oldValue = total[key] || 0;
          total[key] = oldValue + value;
        }
      }
    }
    this.membersData.push(total);
  }
  getAll(aggregation: Aggregation, m: Member) {
    const memberTotalPerCategory = {};

    const inputCategorieskey = _.keys(_.get(aggregation, 'input.perCategory'));
    const outCategorieskey = _.keys(_.get(aggregation, 'output.perCategory'));

    inputCategorieskey.forEach(key => {
      memberTotalPerCategory[key] = _.get(
        aggregation,
        `input.perCategory.${key}`
      );
    });

    outCategorieskey.forEach(key => {
      const amount = _.get(aggregation, `output.perCategory.${key}`);
      if (amount) {
        memberTotalPerCategory[key] = -1 * +amount;
      }
    });

    const inputTotal = _.get(aggregation, 'input.total') || 0;
    const outputTotal = _.get(aggregation, 'output.total') || 0;
    const balance = +inputTotal - +outputTotal;

    return {
      fullName: `${m.firstName} ${m.lastName}`,
      ...memberTotalPerCategory,
      inputTotal,
      outputTotal,
      balance
    };
  }
}
