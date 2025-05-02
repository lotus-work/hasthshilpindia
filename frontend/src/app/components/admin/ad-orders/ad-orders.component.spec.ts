import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdOrdersComponent } from './ad-orders.component';

describe('AdOrdersComponent', () => {
  let component: AdOrdersComponent;
  let fixture: ComponentFixture<AdOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
