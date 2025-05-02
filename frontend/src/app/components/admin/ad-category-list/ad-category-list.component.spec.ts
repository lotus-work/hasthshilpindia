import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdCategoryListComponent } from './ad-category-list.component';

describe('AdCategoryListComponent', () => {
  let component: AdCategoryListComponent;
  let fixture: ComponentFixture<AdCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdCategoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
