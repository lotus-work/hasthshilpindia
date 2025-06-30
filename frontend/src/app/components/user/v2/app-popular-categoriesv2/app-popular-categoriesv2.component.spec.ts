import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPopularCategoriesv2Component } from './app-popular-categoriesv2.component';

describe('AppPopularCategoriesv2Component', () => {
  let component: AppPopularCategoriesv2Component;
  let fixture: ComponentFixture<AppPopularCategoriesv2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppPopularCategoriesv2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppPopularCategoriesv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
