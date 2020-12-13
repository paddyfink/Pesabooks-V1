import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupsRoutingModule } from './groups-routing.module';

@NgModule({
  imports: [
    CommonModule,
    GroupsRoutingModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [GroupDetailComponent]
})
export class GroupsModule {}
