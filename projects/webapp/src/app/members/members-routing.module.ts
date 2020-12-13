import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MemberViewComponent } from './member-view/member-view.component';
import { MembersComponent } from './members/members.component';

const routes: Routes = [
  { path: '', component: MembersComponent },
  { path: ':/id', component: MemberViewComponent },
  { path: ':/id/edit', component: MemberEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule {}
