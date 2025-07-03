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
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
interface CategoryData {
  categoryName: string;
  rawTitle: string;
  title?: SafeHtml;
  description: string;
  image: string;
}
@Component({
  selector: 'app-app-popular-categoriesv2',
  templateUrl: './app-popular-categoriesv2.component.html',
  styleUrl: './app-popular-categoriesv2.component.css',
})
export class AppPopularCategoriesv2Component
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() availableProductsOnlyCategories: { category: any; product: any }[] =
    [];

  @ViewChild('sliderTrack') sliderTrack!: ElementRef<HTMLDivElement>;
  private autoScrollInterval: any;
  isMobile: boolean = false;

  categoryDetails: CategoryData[] = [
    {
      categoryName: 'Saree',
      rawTitle:
        'Light Up Peace, <span style="color:#0464cb;">Breathe</span> In Tranquility',
      description: 'Let the Aroma Guide You to Tranquility',
      image: '../../../../../assets/img/categories/Saree.svg',
    },
    {
      categoryName: 'Jute',
      rawTitle:
        'Eco-Friendly <span style="color:#0464cb;">Elegance</span> in Every Thread',
      description:
        'Discover sustainable style with our beautifully crafted jute products',
      image: '../../../../../assets/img/categories/jute.png',
    },
    {
      categoryName: 'Unstitched Suits',
      rawTitle: 'Craft Your <span style="color:#0464cb;">Perfect Look</span>',
      description: 'Premium unstitched suits for the designer in you',
      image: '../../../../../assets/img/categories/Suits.svg',
    },
    {
      categoryName: 'Purse',
      rawTitle:
        'Carry <span style="color:#0464cb;">Elegance</span> in Every Step',
      description: 'Exquisite stone purses for a touch of glam',
      image: '../../../../../assets/img/categories/handbags.svg',
    },
    {
      categoryName: 'Herbal Soap',
      rawTitle:
        'Soothe Your Soul with <span style="color:#0464cb;">Herbal Goodness</span>',
      description:
        'Warm up with our nourishing herbal soups made from natural ingredients',
      image: '../../../../../assets/img/categories/soap.png',
    },
    {
      categoryName: 'Bedsheets',
      rawTitle:
        'Wrap Yourself in <span style="color:#0464cb;">Softness</span> and Serenity',
      description:
        'High-quality bedsheets designed for ultimate comfort and style',
      image: '../../../../../assets/img/categories/bedsheets.png',
    },
    {
      categoryName: 'Apparel',
      rawTitle:
        'Step into <span style="color:#0464cb;">Style</span> with Authentic Fashion',
      description:
        'From traditional to modern, dress in pieces that tell a story',
      image: '../../../../../assets/img/categories/appreal.png',
    },
    {
      categoryName: 'Winter Deals',
      rawTitle: 'Stay Warm, <span style="color:#0464cb;">Save More</span>',
      description:
        'Special winter collection and offers to keep you cozy and stylish',
      image: '../../../../../assets/img/categories/appreal.png',
    },
    {
      categoryName: 'Home Decor',
      rawTitle:
        'Turn Your Home into a <span style="color:#0464cb;">Masterpiece</span>',
      description: 'Explore handcrafted pieces to transform your living space',
      image: '../../../../../assets/img/categories/homedecor.png',
    },
    {
      categoryName: 'Handloom',
      rawTitle:
        '"Light Up Peace, <span style="color:#0464cb;">Breathe</span> In Tranquility."',
      description: '"Let the Aroma Guide You to Tranquility."',
      image: '../../../../../assets/img/categories/Handloom.png',
    },
    {
      categoryName: 'Stone',
      rawTitle:
        'Experience the <span style="color:#0464cb;">Strength</span> and Beauty of Stone',
      description:
        'Timeless stone artifacts and decor that bring natural elegance to your space',
      image: '../../../../../assets/img/categories/stone.png',
    },
    {
      categoryName: 'Stitched Suits',
      rawTitle:
        'Ready to Wear, <span style="color:#0464cb;">Made to Impress</span>',
      description: 'Stylish stitched suits for effortless fashion',
      image: '../../../../../assets/img/categories/Suits.svg',
    },
    {
      categoryName: 'Incense Sticks',
      rawTitle:
        'Awaken Your Senses with <span style="color:#0464cb;">Sacred Scents</span>',
      description: 'Purify your space with our hand-rolled incense sticks',
      image: '../../../../../assets/img/categories/incense.png',
    },
  ];
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 992; // Bootstrap's 'lg' breakpoint
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
