import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdAddProductsComponent } from './ad-add-products.component';

describe('AdAddProductsComponent', () => {
  let component: AdAddProductsComponent;
  let fixture: ComponentFixture<AdAddProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdAddProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdAddProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
