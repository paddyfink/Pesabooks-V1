import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionPerCategoryTypeComponent } from './transaction-per-category-type.component';

describe('TransactionPerCategoryTypeComponent', () => {
  let component: TransactionPerCategoryTypeComponent;
  let fixture: ComponentFixture<TransactionPerCategoryTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionPerCategoryTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionPerCategoryTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
