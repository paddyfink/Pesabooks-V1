import { InjectionToken } from '@angular/core';
import { Transaction } from '@app/models';

export const TRANSACTION_DIALOG_DATA = new InjectionToken<Transaction>(
  'TRANSACTION_DIALOG_DATA'
);
