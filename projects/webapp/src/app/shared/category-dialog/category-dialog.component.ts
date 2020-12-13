import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Category } from '@app/models';
import { CategoriesService } from '@app/services';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent extends BaseComponent implements OnInit {
  category: Category;
  categoryForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private categoriesService: CategoriesService
  ) {
    super();
    this.category = data.category;
  }

  ngOnInit() {
    this.currentGroup$.pipe(takeUntil(this.ngUnsubscribe)).subscribe();

    this.categoryForm = this.fb.group({
      name: [this.category ? this.category.name : '', Validators.required],
      type: [this.category ? this.category.type : null, Validators.required],
      color: [this.category ? this.category.color : null]
    });
  }

  async save() {
    this.categoryForm.markAsTouched();
    if (this.categoryForm.valid) {
      if (this.category) {
        this.categoriesService.updateCategory(
          this.currentGroup.id,
          this.category.id,
          this.categoryForm.value
        );
        this.dialogRef.close(this.category.id);
      } else {
        const newCategoryId = await this.categoriesService.create(
          this.currentGroup.id,
          this.categoryForm.value
        );
        this.dialogRef.close(newCategoryId);
      }
    }
  }
}
