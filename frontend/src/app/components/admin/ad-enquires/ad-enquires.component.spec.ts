import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdEnquiresComponent } from './ad-enquires.component';

describe('AdEnquiresComponent', () => {
  let component: AdEnquiresComponent;
  let fixture: ComponentFixture<AdEnquiresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdEnquiresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdEnquiresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
