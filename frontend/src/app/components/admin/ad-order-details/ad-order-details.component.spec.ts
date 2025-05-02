import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdOrderDetailsComponent } from './ad-order-details.component';

describe('AdOrderDetailsComponent', () => {
  let component: AdOrderDetailsComponent;
  let fixture: ComponentFixture<AdOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdOrderDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
