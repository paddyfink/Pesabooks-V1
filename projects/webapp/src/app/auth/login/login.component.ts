import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services';
import { TdLoadingService, TdMessageComponent } from '@covalent/core';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild(TdMessageComponent) messageComponent: TdMessageComponent;
  errorMessage: string;

  translations: any;
  groupId: string;
  form: FormGroup;
  next: string;
  showEmailSigninForm = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private translate: TranslateService,
    public afAuth: AngularFireAuth,
    private loadingService: TdLoadingService
  ) {}

  ngOnInit() {
    this.translate
      .get(['app.auth.invalidInvitation', 'app.auth.restriction'])
      .subscribe((res: object) => {
        this.translations = res;
      });

    this.route.queryParams.subscribe(async params => {
      if (params['next']) {
        this.next = params['next'];
      }
    });

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.afAuth.authState.subscribe(async firebaseUser => {
      if (firebaseUser) {
        //this.onSuccessSignIn(firebaseUser);
      }
    });
  }

  displayErrorMessage(message: string) {
    this.errorMessage = message;
    this.messageComponent.open();
  }

  get emailControl() {
    return this.form.get('email');
  }
  get passwordControl() {
    return this.form.get('password');
  }

  async signInWithFacebook() {
    await this.authService.signInWithFacebook();
    this.onSignInSuccess();
  }

  async signInWithGoogle() {
    await this.authService.signInWithGoogle();
    this.onSignInSuccess();
  }

  async signIn() {
    this.loadingService.register('loading');
    try {
      const formValue = this.form.value;
      await this.authService.signIn(formValue.email, formValue.password);
      this.onSignInSuccess();
    } catch (error) {
      this.loadingService.resolve('loading');
      this.errorMessage = error.message;
      this.messageComponent.open();
    }
  }

  async loginWithDemoAccount() {
    this.loadingService.register('loading');
    try {
      await this.authService.signIn(
        environment.demoAccount.email,
        environment.demoAccount.password,
        'none'
      );
      this.onSignInSuccess();
    } catch (error) {
      this.loadingService.resolve('loading');
      this.errorMessage = error.message;
      this.messageComponent.open();
    }
  }

  onSignInSuccess() {
    this.router.navigateByUrl(this.next);
  }
}
