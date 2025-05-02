import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingPloicyComponent } from './shipping-ploicy.component';

describe('ShippingPloicyComponent', () => {
  let component: ShippingPloicyComponent;
  let fixture: ComponentFixture<ShippingPloicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShippingPloicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingPloicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
