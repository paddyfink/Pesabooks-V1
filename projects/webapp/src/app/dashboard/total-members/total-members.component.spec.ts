import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalMembersComponent } from './total-members.component';

describe('TotalMembersComponent', () => {
  let component: TotalMembersComponent;
  let fixture: ComponentFixture<TotalMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
