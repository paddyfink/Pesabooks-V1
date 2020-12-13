import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, GroupGuard } from '@app/core';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  {
    path: '',
    component: MainComponent,
    //GroupGuard
    canActivate: [AuthGuard, GroupGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'members',
        loadChildren: './members/members.module#MembersModule'
      },
      {
        path: 'transactions',
        loadChildren: './transactions/transactions.module#TransactionsModule'
      },
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
      },
      {
        path: 'host',
        loadChildren: './host/host.module#HostModule'
      },
      {
        path: 'report',
        loadChildren: './report/report.module#ReportModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
