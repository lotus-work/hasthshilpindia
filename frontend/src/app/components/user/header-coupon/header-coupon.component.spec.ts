import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCouponComponent } from './header-coupon.component';

describe('HeaderCouponComponent', () => {
  let component: HeaderCouponComponent;
  let fixture: ComponentFixture<HeaderCouponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderCouponComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
