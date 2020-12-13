import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { routerAnimation } from '@utils/page.animation';
import { AuthService } from '@app/services';
import { TdLoadingService, TdMessageComponent } from '@covalent/core';
import { PasswordValidation } from './password-validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild(TdMessageComponent) messageComponent: TdMessageComponent;
  errorMsg: string;
  form: FormGroup;
  next: string;

  // Add router animation
  //  @HostBinding('@routerAnimation') routerAnimation = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private _loadingService: TdLoadingService
  ) {}

  ngOnInit() {
    this.form = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        repeatPassword: ['', [Validators.required]]
      },
      {
        validator: PasswordValidation.MatchPassword
      }
    );

    this.route.queryParams.subscribe(async params => {
      if (params['next']) this.next = params['next'];
    });
  }

  get firstNameControl() {
    return this.form.get('firstName');
  }
  get lastNameControl() {
    return this.form.get('lastName');
  }
  get emailControl() {
    return this.form.get('email');
  }
  get passwordControl() {
    return this.form.get('password');
  }
  get repeatPasswordControl() {
    return this.form.get('repeatPassword');
  }

  async register() {
    this._loadingService.register('loading');

    try {
      const formValue = this.form.value;
      await this.authService.register(
        formValue.firstName,
        formValue.lastName,
        formValue.email,
        formValue.password
      );
      this.onRegisterSuccess();
    } catch (error) {
      this._loadingService.resolve('loading');
      this.errorMsg = error.message;
      this.messageComponent.open();
    }
  }

  onRegisterSuccess() {
    this.router.navigateByUrl(this.next);
  }
}
