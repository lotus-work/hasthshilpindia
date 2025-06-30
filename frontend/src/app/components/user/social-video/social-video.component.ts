import { Component } from '@angular/core';

@Component({
  selector: 'app-social-video',
  templateUrl: './social-video.component.html',
  styleUrl: './social-video.component.css'
})
export class SocialVideoComponent {
ngAfterViewInit() {
  const video: HTMLVideoElement | null = document.querySelector('.video-content');
  if (video) {
    video.muted = true;
    video.play(); // re-trigger play after setting muted
  }
}
}
