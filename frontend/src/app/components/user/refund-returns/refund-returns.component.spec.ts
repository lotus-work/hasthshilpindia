import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundReturnsComponent } from './refund-returns.component';

describe('RefundReturnsComponent', () => {
  let component: RefundReturnsComponent;
  let fixture: ComponentFixture<RefundReturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefundReturnsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
