import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Category } from '@app/models';
import { AggregationService, NavigationService } from '@app/services';
import { BaseComponent } from '@app/shared';
import { formatMonthYear } from '@app/utils/helpers';
import { TranslateService } from '@ngx-translate/core';
import { get, keys } from 'lodash';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [CurrencyPipe]
})
export class DashboardComponent extends BaseComponent implements OnInit {
  translations: any;
  balance = 0;
  loanPerStatus: any = {};
  categories: Category[];
  single = [];
  receivedSentDataset = [];
  colorScheme = {
    domain: [
      '#36A2EB',
      '#FF6384',
      '#FFCE56',
      '#4BC0C0',
      '#97BBCD',
      '#F7464A',
      '#46BFBD',
      '#FDB45C',
      '#949FB1',
      '#4D5360'
    ]
  };

  constructor(
    private currencyPipe: CurrencyPipe,
    private aggregationService: AggregationService,
    private translateService: TranslateService,
    private navigationService: NavigationService
  ) {
    super();
  }

  ngOnInit() {
    this.navigationService.setPageTitle('app.common.dashboard');

    this.translateService
      .get(['app.dashboard.received', 'app.dashboard.sent'])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: object) => {
        this.translations = res;
      });

    this.currentGroup$
      .pipe(
        switchMap(group =>
          this.aggregationService.getTransactionsPerMonth(group.id)
        ),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(aggreationsPerMonth => {
        this.balance =
          (+this.currentGroup.openingBalance || 0) +
          (+get(this.currentGroup, 'aggregation.input.total') || 0) -
          (+get(this.currentGroup, 'aggregation.output.total') || 0);

        const dataset = [];
        aggreationsPerMonth.map(aggPerMonth => {
          dataset.push({
            name: formatMonthYear(aggPerMonth.dateMonth, aggPerMonth.dateYear),
            series: [
              {
                name: this.translations['app.dashboard.received'],
                value: get(aggPerMonth, 'input.total') || 0
              },
              {
                name: this.translations['app.dashboard.sent'],
                value: get(aggPerMonth, 'output.total') || 0
              }
            ]
          });
        });
        this.single = dataset;

        this.receivedSentDataset = [
          {
            name: this.translations['app.dashboard.received'],
            value: get(this.currentGroup, 'aggregation.input.total') || 0
          },
          {
            name: this.translations['app.dashboard.sent'],
            value: get(this.currentGroup, 'aggregation.output.total') || 0
          }
        ];

        this.loanPerStatus = {
          input: {
            paid: 0,
            unpaid: 0
          },
          output: {
            paid: 0,
            unpaid: 0
          }
        };

        aggreationsPerMonth.forEach(m => {
          const inputLoanStatusKey = keys(m.input.loan.perStatus);
          const outputLoanStatusKey = keys(m.output.loan.perStatus);

          // Loan Status
          inputLoanStatusKey.forEach(key => {
            const value = this.loanPerStatus.input[key] || 0;
            this.loanPerStatus.input[key] = value + m.input.loan.perStatus[key];
          });

          outputLoanStatusKey.forEach(key => {
            const value = this.loanPerStatus.output[key] || 0;
            this.loanPerStatus.output[key] =
              value + m.output.loan.perStatus[key];
          });
        });
      });
  }

  axisCurrencyFormatFn = val => {
    return this.formatCurrency(val);
  };

  formatCurrency(val) {
    return this.currencyPipe.transform(
      val,
      this.currentGroup ? this.currentGroup.currency : '',
      'symbol-narrow',
      '1.0-0'
    );
  }
}
