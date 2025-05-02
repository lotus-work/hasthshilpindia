import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdCustomersComponent } from './ad-customers.component';

describe('AdCustomersComponent', () => {
  let component: AdCustomersComponent;
  let fixture: ComponentFixture<AdCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdCustomersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
