import { Component, OnInit } from '@angular/core';
import { Transaction, TransactionLine } from '@app/models';
import {
  CategoriesService,
  MembersService,
  TransactionsService
} from '@app/services';
import { BaseComponent } from '@app/shared';
import * as _ from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-latest-transactions',
  templateUrl: './latest-transactions.component.html',
  styleUrls: ['./latest-transactions.component.css']
})
export class LatestTransactionsComponent extends BaseComponent
  implements OnInit {
  transactions$: Observable<Transaction[]>;
  columns = ['date', 'member', 'category', 'total'];

  constructor(
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private membersService: MembersService
  ) {
    super();
  }

  ngOnInit() {
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
        this.transactions$ = this.transactionsService
          .getLatestTransactions(this.currentGroup.id)
          .pipe(
            map(transactions =>
              transactions.map((t: Transaction) => {
                return <Transaction>{
                  ...t,
                  date: t.date ? t.date.toDate() : null,
                  dueDate: t.dueDate ? t.dueDate.toDate() : null,
                  lines: t.lines.map((line: TransactionLine) => {
                    return {
                      ...line,
                      categoryName: _.get(
                        _.find(categories, { id: line.categoryId }),
                        'name'
                      )
                    };
                  }),
                  memberFullName: _.get(
                    _.find(members, { id: t.memberId }),
                    'fullName'
                  )
                };
              })
            )
          );
      });
  }
}
