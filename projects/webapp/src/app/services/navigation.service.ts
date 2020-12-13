import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private _pageTitle = new Subject<string>();

  constructor() {}

  get PageTitle(): Observable<string> {
    return this._pageTitle.asObservable().pipe(startWith('Pesabooks'));
  }

  setPageTitle(title: string) {
    this._pageTitle.next(title);
  }
}
