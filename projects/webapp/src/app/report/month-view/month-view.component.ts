import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Aggregation, Category, Group, Member } from '@app/models';
import { AggregationService } from '@app/services';
import { orderCategories } from '@app/utils/helpers';
import { ITdDataTableColumn } from '@covalent/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss']
})
export class MonthViewComponent implements OnInit, OnDestroy {
  @Input() date: any;
  @Input() categories: Category[];
  @Input() members: Member[];
  @Input() group: Group;
  configWidthColumns: ITdDataTableColumn[] = [];
  membersData = [];
  months = [];
  subscription: Subscription;

  constructor(private aggregationService: AggregationService) {}

  ngOnInit() {
    this.configWidthColumns = [];
    this.membersData = [];

    orderCategories(this.categories).forEach(category => {
      this.configWidthColumns.push({
        name: category.id,
        label: category.name,
        numeric: true
      });
    });

    if (this.date) {
      this.subscription = this.aggregationService
        .getTransactionsPerMonthPerMember(this.group.id, q =>
          q
            .where('dateMonth', '==', this.date.month)
            .where('dateYear', '==', this.date.year)
        )
        .subscribe(aggs => {
          this.membersData = _.orderBy(
            aggs.map(agg =>
              this.flattenAggregation(
                agg,
                _.find(this.members, { id: agg.memberId })
              )
            ),
            ['fullName']
          );
          this.calculTotal();
        });
    } else {
      this.membersData = this.members.map(member =>
        this.flattenAggregation(member.aggregation, member)
      );
      this.calculTotal();
    }
  }

  calculTotal() {
    const total = {
      fullName: 'Total'
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

  flattenAggregation(aggregation: Aggregation, m: Member) {
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
