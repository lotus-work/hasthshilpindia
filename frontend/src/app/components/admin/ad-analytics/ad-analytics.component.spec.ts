import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdAnalyticsComponent } from './ad-analytics.component';

describe('AdAnalyticsComponent', () => {
  let component: AdAnalyticsComponent;
  let fixture: ComponentFixture<AdAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
