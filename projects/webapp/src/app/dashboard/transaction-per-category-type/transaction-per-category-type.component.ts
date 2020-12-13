import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CategoriesService } from '@app/services';
import { BaseComponent } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-transaction-per-category-type',
  templateUrl: './transaction-per-category-type.component.html',
  styleUrls: ['./transaction-per-category-type.component.scss'],
  providers: [CurrencyPipe]
})
export class TransactionPerCategoryTypeComponent extends BaseComponent
  implements OnInit {
  @Input() direction = 'input';
  categoryTypesTranslations: any;
  transactionAmountByCateogry = {};

  constructor(
    private translateService: TranslateService,
    private categoriesService: CategoriesService
  ) {
    super();
  }

  ngOnInit() {
    this.translateService
      .get('app.settings.categories')
      .subscribe(translations => {
        this.categoryTypesTranslations = translations;
      });

    this.currentGroup$
      .pipe(
        switchMap(group => this.categoriesService.getCategories(group.id)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(categories => {
        this.transactionAmountByCateogry = {};
        const inputCategories = _.get(
          this.currentGroup,
          'aggregation.input.perCategory'
        );

        const outputCategories = _.get(
          this.currentGroup,
          'aggregation.output.perCategory'
        );

        let categorieskey = _.keys(inputCategories);

        for (const inputCategoryKey of categorieskey) {
          if (inputCategoryKey) {
            const categoryName = _.chain(categories)
              .find({ id: inputCategoryKey })
              .get('name')
              .value();
            const categoryAmount = inputCategories[inputCategoryKey];

            this.transactionAmountByCateogry[categoryName] = categoryAmount;
          }
        }

        categorieskey = _.keys(outputCategories);

        for (const categoryKey of categorieskey) {
          if (categoryKey) {
            const categoryName = _.chain(categories)
              .find({ id: categoryKey })
              .get('name')
              .value();
            const categoryAmount = -1 * +outputCategories[categoryKey];
            if (this.transactionAmountByCateogry[categoryName]) {
              const ss = +this.transactionAmountByCateogry[categoryName];
              this.transactionAmountByCateogry[categoryName] =
                ss + categoryAmount;
            } else
              this.transactionAmountByCateogry[categoryName] = categoryAmount;
          }
        }
      });
  }
}
