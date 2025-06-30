import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Homev2Component } from './homev2.component';

describe('Homev2Component', () => {
  let component: Homev2Component;
  let fixture: ComponentFixture<Homev2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Homev2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Homev2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
