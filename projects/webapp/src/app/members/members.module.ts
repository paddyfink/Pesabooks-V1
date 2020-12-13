import { NgModule } from '@angular/core';

import { MembersRoutingModule } from './members-routing.module';
import { MembersComponent } from './members/members.component';
import { MembersListComponent } from './members-list/members-list.component';
import { MemberViewComponent } from './member-view/member-view.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [SharedModule, MembersRoutingModule],
  declarations: [
    MembersComponent,
    MembersListComponent,
    MemberViewComponent,
    MemberEditComponent
  ]
})
export class MembersModule {}
