import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { LatestTransactionsComponent } from './latest-transactions/latest-transactions.component';
import { TotalMembersComponent } from './total-members/total-members.component';
import { TransactionPerCategoryTypeComponent } from './transaction-per-category-type/transaction-per-category-type.component';
import { UpcomingLoansComponent } from './upcoming-loans/upcoming-loans.component';

@NgModule({
  imports: [CommonModule, DashboardRoutingModule, SharedModule],
  declarations: [
    DashboardComponent,
    TransactionPerCategoryTypeComponent,
    UpcomingLoansComponent,
    LatestTransactionsComponent,
    TotalMembersComponent
  ]
})
export class DashboardModule {}
