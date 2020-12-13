import {
  FullscreenOverlayContainer,
  OverlayContainer
} from '@angular/cdk/overlay';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injector, NgModule } from '@angular/core';
import { MatDialogConfig, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CoreModule } from '@app/core';
import { ServiceLocator } from '@app/services';
import { TransactionOverlayComponent } from '@app/transaction-overlay/components/transaction-overlay.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import * as Raven from 'raven-js';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { SharedModule } from './shared/shared.module';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(<any>httpClient, '/assets/i18n/', '.json');
}

Raven.config(environment.sentry).install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err.originalError || err);
  }
}

export function provideErrorHandler() {
  if (environment.production) {
    return new RavenErrorHandler();
  } else {
    return new ErrorHandler();
  }
}

@NgModule({
  declarations: [AppComponent, MainComponent, TransactionOverlayComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [
    { provide: ErrorHandler, useFactory: provideErrorHandler },
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: <MatDialogConfig>{
        hasBackdrop: true,
        minWidth: '350px',
        data: {}
      }
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [TransactionOverlayComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}
