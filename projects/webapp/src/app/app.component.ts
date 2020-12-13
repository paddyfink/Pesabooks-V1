import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  constructor(
    translate: TranslateService,
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
  ) {
    let lang = translate.getBrowserLang();
    lang = /(en|fr)/gi.test(lang) ? lang : 'en';
    // Set fallback languagecd
    translate.setDefaultLang('en');
    // Supported languages
    translate.use('en');
  }
}
