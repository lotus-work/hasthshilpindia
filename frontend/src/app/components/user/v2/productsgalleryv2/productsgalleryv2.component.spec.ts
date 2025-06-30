import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productsgalleryv2Component } from './productsgalleryv2.component';

describe('Productsgalleryv2Component', () => {
  let component: Productsgalleryv2Component;
  let fixture: ComponentFixture<Productsgalleryv2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Productsgalleryv2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productsgalleryv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
