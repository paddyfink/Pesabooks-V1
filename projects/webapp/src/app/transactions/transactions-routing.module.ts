import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
  { path: '', component: TransactionsComponent },
  { path: ':/id', component: TransactionDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {}
