import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Transaction } from '@app/models';
import { TransactionOverlayComponent } from '../components/transaction-overlay.component';
import { TRANSACTION_DIALOG_DATA } from './../transaction-overlay.tokens';
import { TransactionOverlayRef } from './../transactionOverlayRef';

interface TransactionDialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  transaction?: Transaction;
}

const DEFAULT_CONFIG: TransactionDialogConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'transaction-dialog-panel'
};

@Injectable({
  providedIn: 'root'
})
export class TransactionOverlayService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open(config: TransactionDialogConfig = {}): TransactionOverlayRef {
    // Returns an OverlayRef (which is a PortalHost)
    // Override default configuration
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };

    const overlayRef = this.createOverlay(dialogConfig);

    // Instantiate remote control
    const dialogRef = new TransactionOverlayRef(overlayRef);

    const overlayComponent = this.attachDialogContainer(
      overlayRef,
      dialogConfig,
      dialogRef
    );

    overlayRef.backdropClick().subscribe(_ => dialogRef.close());

    return dialogRef;
  }

  private attachDialogContainer(
    overlayRef: OverlayRef,
    config: TransactionDialogConfig,
    dialogRef: TransactionOverlayRef
  ) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(
      TransactionOverlayComponent,
      null,
      injector
    );
    const containerRef: ComponentRef<
      TransactionOverlayComponent
    > = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private getOverlayConfig(config: TransactionDialogConfig): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }

  private createOverlay(config: TransactionDialogConfig) {
    // Returns an OverlayConfig
    const overlayConfig = this.getOverlayConfig(config);

    // Returns an OverlayRef
    return this.overlay.create(overlayConfig);
  }

  private createInjector(
    config: TransactionDialogConfig,
    dialogRef: TransactionOverlayRef
  ): PortalInjector {
    // Instantiate new WeakMap for our custom injection tokens
    const injectionTokens = new WeakMap();

    // Set custom injection tokens
    injectionTokens.set(TransactionOverlayRef, dialogRef);
    injectionTokens.set(TRANSACTION_DIALOG_DATA, config.transaction);

    // Instantiate new PortalInjector
    return new PortalInjector(this.injector, injectionTokens);
  }
}
