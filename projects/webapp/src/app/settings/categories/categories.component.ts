import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Category } from '@app/models';
import { CategoriesService } from '@app/services';
import { BaseComponent, CategoryDialogComponent } from '@app/shared';
import { TdDialogService } from '@covalent/core';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent extends BaseComponent implements OnInit {
  //@Select(CategoriesState.categories) categories$: Observable<Category>;
  categories: Category[];

  constructor(
    public dialog: MatDialog,
    private _dialogService: TdDialogService,
    private categoryService: CategoriesService
  ) {
    super();
  }

  ngOnInit() {
    this.currentGroup$
      .pipe(
        switchMap(group => this.categoryService.getCategories(group.id)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(categories => {
        this.categories = categories;
      });
  }

  openCategoryModal(category = null) {
    this.dialog.open(CategoryDialogComponent, {
      data: { category }
    });
  }

  openPrompt(): void {
    this._dialogService
      .openPrompt({
        message: '',

        title: 'New Category', //OPTIONAL, hides if not provided
        //value: 'Prepopulated value', //OPTIONAL
        cancelButton: 'Cancel',
        acceptButton: 'Ok',
        width: '400px'
      })
      .afterClosed()
      .subscribe((newValue: string) => {
        if (newValue) {
          this.categoryService.create(this.currentGroup.id, <Category>{
            name: newValue
          });
        } else {
          // DO SOMETHING ELSE
        }
      });
  }
}
