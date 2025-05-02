import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  PLATFORM_ID,
  Inject,
  ViewChild,
  ElementRef,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-popular-categories',
  templateUrl: './popular-categories.component.html',
  styleUrls: ['./popular-categories.component.css']
})
export class PopularCategoriesComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() availableProductsOnlyCategories: { category: any; product: any }[] = [];

  @ViewChild('sliderTrack') sliderTrack!: ElementRef<HTMLDivElement>;
  private autoScrollInterval: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.startAutoScroll(), 100); // delay to make sure DOM is ready
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['availableProductsOnlyCategories'] && this.sliderTrack) {
      this.resetAutoScroll();
    }
  }

  ngOnDestroy(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }
  
  startAutoScroll(): void {
    let scrollAmount = 0;
    const scrollStep = 200; // Adjust based on item width
    const delay = 3000; // 3 seconds
  
    this.autoScrollInterval = setInterval(() => {
      if (this.sliderTrack && this.sliderTrack.nativeElement) {
        const el = this.sliderTrack.nativeElement;
        scrollAmount += scrollStep;
  
        if (scrollAmount >= el.scrollWidth - el.clientWidth) {
          scrollAmount = 0;
        }
  
        el.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      }
    }, delay);
  }


  private resetAutoScroll(): void {
    clearInterval(this.autoScrollInterval);
    setTimeout(() => this.startAutoScroll(), 100);
  }
}
