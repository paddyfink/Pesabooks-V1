import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { FirebaseUIModule } from 'firebaseui-angular';
import { AuthRoutingModule } from './auth-routing.module';
import { InvitationComponent } from './invitation/invitation.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RequestAccessComponent } from './request-access/request-access.component';

@NgModule({
  imports: [SharedModule, AuthRoutingModule, FirebaseUIModule],
  declarations: [
    RegisterComponent,
    LoginComponent,
    RequestAccessComponent,
    InvitationComponent
  ],
  providers: []
})
export class AuthModule {}
