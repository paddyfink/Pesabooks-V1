import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvitationComponent } from './invitation/invitation.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RequestAccessComponent } from './request-access/request-access.component';

const routes: Routes = [
  { path: '', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'invitation', component: InvitationComponent },
  { path: 'request', component: RequestAccessComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
