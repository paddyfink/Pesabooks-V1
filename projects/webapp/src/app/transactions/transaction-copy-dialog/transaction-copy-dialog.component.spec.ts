import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCopyDialogComponent } from './transaction-copy-dialog.component';

describe('TransactionCopyDialogComponent', () => {
  let component: TransactionCopyDialogComponent;
  let fixture: ComponentFixture<TransactionCopyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionCopyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionCopyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
