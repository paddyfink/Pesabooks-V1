import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  AggregationService,
  AuthService,
  CategoriesService,
  CurrenciesService,
  GroupsService,
  MembersService,
  TransactionsService,
  UsersService
} from '@app/services';
import { TransactionState } from '@app/transactions';
import { environment } from '@environments/environment';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsModule } from '@ngxs/store';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import {
  AuthMethods,
  AuthProvider,
  CredentialHelper,
  FirebaseUIAuthConfig,
  FirebaseUIModule
} from 'firebaseui-angular';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AuthGuard } from './guards/auth.guard';
import { GroupGuard } from './guards/group.guard';

const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProvider.Google,
    AuthProvider.Facebook,
    AuthProvider.Password
  ],
  method: AuthMethods.Popup,
  tos: '',
  credentialHelper: CredentialHelper.None,
  autoUpgradeAnonymousUsers: false
};

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgxsModule.forRoot([TransactionState]),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    }),
    NgxsFormPluginModule.forRoot(),
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    NgxPermissionsModule.forRoot()
  ],
  exports: [HttpClientModule],
  declarations: [],
  providers: [
    AuthGuard,
    GroupGuard,
    AngularFireAuth,
    AngularFirestore,
    AuthService,
    GroupsService,
    CategoriesService,
    MembersService,
    TransactionsService,
    AggregationService,
    UsersService,
    CurrenciesService
  ]
})
export class CoreModule {
  constructor(private afs: AngularFirestore) {
    afs.firestore.settings({ timestampsInSnapshots: true });
    afs.firestore.enablePersistence();
  }
}
