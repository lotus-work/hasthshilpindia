import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdProductListComponent } from './ad-product-list.component';

describe('AdProductListComponent', () => {
  let component: AdProductListComponent;
  let fixture: ComponentFixture<AdProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdProductListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
