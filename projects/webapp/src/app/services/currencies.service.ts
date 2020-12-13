import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CurrenciesService {
  constructor(private httpClient: HttpClient) {}

  getCurrencies(): Observable<any[]> {
    return this.httpClient
      .get(`https://openexchangerates.org/api/currencies.json`)
      .pipe(
        map(currencies => {
          const currencyArray = [];
          for (const key in currencies) {
            if (currencies.hasOwnProperty(key)) {
              currencyArray.push({
                text: currencies[key],
                value: key
              });
            }
          }
          return currencyArray;
        })
      );
  }
}
