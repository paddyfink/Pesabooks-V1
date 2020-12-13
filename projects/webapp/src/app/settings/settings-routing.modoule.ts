import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { GroupSettingsComponent } from './group-settings/group-settings.component';
import { SettingsComponent } from './settings.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'group' },
      { path: 'group', component: GroupSettingsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'users', component: UsersComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
