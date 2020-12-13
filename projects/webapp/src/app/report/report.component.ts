import { Component, OnInit } from '@angular/core';
import { Category, Member } from '@app/models';
import {
  CategoriesService,
  MembersService,
  NavigationService
} from '@app/services';
import { BaseComponent } from '@app/shared';
import { generateMonthsList } from '@app/utils/helpers';
import { reverse } from 'lodash';
import { combineLatest } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent extends BaseComponent implements OnInit {
  months = [];
  categories: Category[];
  members: Member[];
  isInitialised = false;

  constructor(
    private categoriesService: CategoriesService,
    private membersService: MembersService,
    private navigationService: NavigationService
  ) {
    super();
  }

  ngOnInit() {
    this.navigationService.setPageTitle('app.common.dashboard');

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
        this.categories = categories;
        this.members = members;
        this.months = reverse(generateMonthsList(this.currentGroup));
        this.isInitialised = true;
      });
  }
}
