import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdBrandListComponent } from './ad-brand-list.component';

describe('AdBrandListComponent', () => {
  let component: AdBrandListComponent;
  let fixture: ComponentFixture<AdBrandListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdBrandListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdBrandListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
