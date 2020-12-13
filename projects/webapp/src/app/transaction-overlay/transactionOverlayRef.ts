import { OverlayRef } from '@angular/cdk/overlay';

export class TransactionOverlayRef {
  constructor(private overlayRef: OverlayRef) {}

  close(): void {
    this.overlayRef.dispose();
  }
}
