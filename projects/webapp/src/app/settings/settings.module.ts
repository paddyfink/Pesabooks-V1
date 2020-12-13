import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { CategoriesComponent } from './categories/categories.component';
import { GroupSettingsComponent } from './group-settings/group-settings.component';
import { SettingsRoutingModule } from './settings-routing.modoule';
import { SettingsComponent } from './settings.component';
import { InviteUserDialogComponent } from './users/invite-user-dialog/invite-user-dialog.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  imports: [SharedModule, SettingsRoutingModule],
  declarations: [
    SettingsComponent,
    GroupSettingsComponent,
    CategoriesComponent,
    UsersComponent,
    UsersListComponent,
    InviteUserDialogComponent
  ],
  entryComponents: [InviteUserDialogComponent]
})
export class SettingsModule {}
