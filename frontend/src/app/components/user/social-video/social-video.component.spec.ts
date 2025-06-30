import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialVideoComponent } from './social-video.component';

describe('SocialVideoComponent', () => {
  let component: SocialVideoComponent;
  let fixture: ComponentFixture<SocialVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
