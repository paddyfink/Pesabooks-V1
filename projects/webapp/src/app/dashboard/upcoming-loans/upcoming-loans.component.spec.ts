import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingLoansComponent } from './upcoming-loans.component';

describe('UpcomingLoansComponent', () => {
  let component: UpcomingLoansComponent;
  let fixture: ComponentFixture<UpcomingLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
