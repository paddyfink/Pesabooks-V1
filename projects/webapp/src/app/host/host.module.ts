import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { GroupsComponent } from './groups/groups.component';
import { HostRoutingModule } from './host-routing.module';

@NgModule({
  imports: [HostRoutingModule, SharedModule, TranslateModule.forChild()],
  declarations: [GroupsComponent]
})
export class HostModule {}
