import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdEditProductsComponent } from './ad-edit-products.component';

describe('AdEditProductsComponent', () => {
  let component: AdEditProductsComponent;
  let fixture: ComponentFixture<AdEditProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdEditProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdEditProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
