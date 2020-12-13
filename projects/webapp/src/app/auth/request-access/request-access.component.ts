import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrenciesService } from '@app/services';
import { TdMessageComponent } from '@covalent/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-request-access',
  templateUrl: './request-access.component.html',
  styleUrls: ['./request-access.component.scss']
})
export class RequestAccessComponent implements OnInit {
  @ViewChild(TdMessageComponent) messageComponent: TdMessageComponent;
  errorMsg: string;
  form: FormGroup;
  currencies$: Observable<any[]>;
  showForm = true;

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private afs: AngularFirestore,
    private currenciesService: CurrenciesService
  ) {}

  get membersControl() {
    return this.form.get('members');
  }

  get cityControl() {
    return this.form.get('city');
  }

  get contributionControl() {
    return this.form.get('contribution');
  }

  get currencyControl() {
    return this.form.get('currency');
  }

  get emailControl() {
    return this.form.get('email');
  }

  request() {
    if (this.form.valid) {
      this.afs.collection('accessRequests').add(this.form.value);

      this.messageComponent.open();
      this.form.reset();
      this.showForm = false;
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      contribution: ['', Validators.required],
      currency: ['', [Validators.required]],
      members: ['', [Validators.required]]
    });

    this.currencies$ = this.currenciesService.getCurrencies();
  }
}
