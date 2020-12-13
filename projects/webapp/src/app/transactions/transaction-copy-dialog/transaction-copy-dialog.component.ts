import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-transaction-copy-dialog',
  templateUrl: './transaction-copy-dialog.component.html'
})
export class TransactionCopyDialogComponent implements OnInit {
  formGroup: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TransactionCopyDialogComponent>
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      date: ['', Validators.required],
      dueDate: ''
    });
  }

  save() {
    this.formGroup.markAsUntouched();
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    }
  }
}
