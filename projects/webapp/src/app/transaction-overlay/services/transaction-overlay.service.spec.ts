import { TestBed, inject } from '@angular/core/testing';

import { TransactionOverlayService } from './transaction-overlay.service';

describe('TransactionOverlayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionOverlayService]
    });
  });

  it('should be created', inject([TransactionOverlayService], (service: TransactionOverlayService) => {
    expect(service).toBeTruthy();
  }));
});
