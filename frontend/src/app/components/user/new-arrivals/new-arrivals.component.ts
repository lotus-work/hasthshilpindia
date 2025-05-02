import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-new-arrivals',
  templateUrl: './new-arrivals.component.html',
  styleUrl: './new-arrivals.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewArrivalsComponent {
  products = new Array(2); ngOnInit(): void {}

  getRandomBlue(): string {
    const shadesOfBlue = ['#FAEEE0'];
    return shadesOfBlue[Math.floor(Math.random() * shadesOfBlue.length)];
  }

  getRandomGrey(): string {
    const shadesOfGrey = ['#FFDAA3'];
    return shadesOfGrey[Math.floor(Math.random() * shadesOfGrey.length)];
  }
}