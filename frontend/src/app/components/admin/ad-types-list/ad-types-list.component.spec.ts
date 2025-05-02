import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdTypesListComponent } from './ad-types-list.component';

describe('AdTypesListComponent', () => {
  let component: AdTypesListComponent;
  let fixture: ComponentFixture<AdTypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdTypesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
