import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { TransactionCopyDialogComponent } from './transaction-copy-dialog/transaction-copy-dialog.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions/transactions.component';

@NgModule({
  imports: [
    SharedModule,
    TransactionsRoutingModule,
    NgxsFormPluginModule
    //TranslateModule.forChild()
  ],
  declarations: [
    TransactionDetailComponent,
    TransactionsComponent,
    TransactionFilterComponent,
    TransactionCopyDialogComponent
  ],
  entryComponents: [TransactionCopyDialogComponent]
})
export class TransactionsModule {}
