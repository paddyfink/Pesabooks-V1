import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { MonthViewComponent } from './month-view/month-view.component';
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';

@NgModule({
  imports: [SharedModule, ReportRoutingModule],
  declarations: [ReportComponent, MonthViewComponent]
})
export class ReportModule {}
