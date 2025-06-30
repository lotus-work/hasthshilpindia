import { Component, OnInit } from '@angular/core';
import { forkJoin, firstValueFrom } from 'rxjs';
import { ProductService } from '../../../../services/product/product.service';

@Component({
  selector: 'app-homev2',
  templateUrl: './homev2.component.html',
  styleUrl: './homev2.component.css'
})
export class Homev2Component  implements OnInit {
  messages: string[] = [
    'Celebrate India’s Heritage with Authentic Handlooms and Crafts',
    'Crafted by Hands, Cherished by Hearts',
    'From Rural Roots to Global Homes—Experience True Craftsmanship',
    'Elevate Your Lifestyle with Timeless Indian Artistry',
    'Support Artisans, Embrace Sustainable Elegance',
    'Every Piece Tells a Story of Tradition and Skill',
    'Shop Handmade Treasures, Straight from Indian Artisans'
  ];
  currentMessage = '';
  currentIndex = 0;
  isFading = false;

  categories: any[] = [];
  featuredProducts: any[] = [];
  specialProducts: any[] = [];
  popularProducts: any[] = [];

  displayedFeatured: any[] = [];
  displayedSpecial: any[] = [];
  displayedPopular: any[] = [];

  wishlistProducts: any[] = [];
  availableProductsOnlyCategories: { category: any; product: any }[] = [];
  userCartProducts: any[] = [];
  allProducts: any[] = [];

  constructor(private productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    this.currentMessage = this.messages[this.currentIndex];

    setInterval(() => {
      this.isFading = true;

      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % this.messages.length;
        this.currentMessage = this.messages[this.currentIndex];
        this.isFading = false;
      }, 1000); // match with CSS transition duration
    }, 3000);

    const token = localStorage.getItem('token') || '';
    await this.loadCategoriesAndProductsAsync();
    this.loadWishlist(token);
    this.loadUserCart(token);

    // ✅ Final logs to confirm data is ready
    console.log(
      '✅ availableProductsOnlyCategories:',
      this.availableProductsOnlyCategories
    );
    console.log('all products', this.allProducts);
    console.log('✅ featuredProducts:', this.featuredProducts);
    console.log('✅ specialProducts:', this.specialProducts);
    console.log('✅ popularProducts:', this.popularProducts);
  }

  async loadCategoriesAndProductsAsync(): Promise<void> {
    try {
      console.log('🚀 Fetching categories and products...');

      const result = await firstValueFrom(
        forkJoin({
          categories: this.productService.getCategories(),
          products: this.productService.getAllProducts(),
        })
      );

      // Assign categories and products
      this.categories = result.categories || [];
      this.allProducts = result.products || [];

      console.log('✅ Categories:', this.categories);
      console.log('✅ All Products:', this.allProducts);

      // Filter categories with at least one product
      this.filterCategoriesWithAvailableProducts();

      // Populate featured, special, and popular products
      this.populateProductGroups();
    } catch (error) {
      console.error('❌ Error fetching categories/products:', error);
    }
  }

  filterCategoriesWithAvailableProducts(): void {
    this.availableProductsOnlyCategories = [];

    if (
      !this.categories ||
      this.categories.length === 0 ||
      !this.allProducts ||
      this.allProducts.length === 0
    ) {
      console.warn('⚠️ No categories or products to filter.');
      return;
    }

    this.categories.forEach((category: any) => {
      const productsInCategory = this.allProducts.filter(
        (product: any) => product.category === category.title
      );

      if (productsInCategory.length > 0) {
        const randomProduct =
          productsInCategory[
            Math.floor(Math.random() * productsInCategory.length)
          ];

        this.availableProductsOnlyCategories.push({
          category: category,
          product: randomProduct,
        });
      }
    });
  }

  populateProductGroups(): void {
    if (!this.allProducts || this.allProducts.length === 0) {
      console.warn('⚠️ No products to populate groups.');
      return;
    }

    // Assuming these flags exist in your product model. Adjust as needed.
    this.featuredProducts = this.allProducts.filter(
      (product: any) => product.tags == 'featured'
    );
    this.specialProducts = this.allProducts.filter(
      (product: any) => product.tags == 'special'
    );
    this.popularProducts = this.allProducts.filter(
      (product: any) => product.tags == 'popular'
    );

    // Fallback: if the flags don't exist, pick top products or random selection
    if (this.featuredProducts.length === 0) {
      this.featuredProducts = this.allProducts.slice(0, 5);
    }
    if (this.specialProducts.length === 0) {
      this.specialProducts = this.allProducts.slice(5, 10);
    }
    if (this.popularProducts.length === 0) {
      this.popularProducts = this.allProducts.slice(10, 15);
    }


    this.displayedFeatured = this.getRandomProducts(this.featuredProducts, 15);
    this.displayedSpecial = this.getRandomProducts(this.specialProducts, 15);
    this.displayedPopular = this.getRandomProducts(this.popularProducts, 15);
  
    console.log('✅ Populated featuredProducts:', this.featuredProducts);
    console.log('✅ Populated specialProducts:', this.specialProducts);
    console.log('✅ Populated popularProducts:', this.popularProducts);
  }

  getRandomProducts(products: any[], count: number): any[] {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  loadWishlist(token: any): void {
    this.productService.getUserWishlist(token).subscribe({
      next: (response) => {
        console.log('✅ Wishlist:', response.wishlist);
        this.wishlistProducts = response.wishlist;

        localStorage.setItem('userWishlist', JSON.stringify(this.wishlistProducts));
      },
      error: (error) => {
        console.error('❌ Error fetching wishlist:', error);
      },
    });
  }
  scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  loadUserCart(token: string): void {
    if (!token) {
      console.warn('⚠️ No user token found. Cannot load cart.');
      return;
    }

    this.productService.getUserCart(token).subscribe({
      next: (response) => {
        console.log('✅ User Cart:', response);
        this.userCartProducts = response || [];
        localStorage.setItem('userCart', JSON.stringify(this.userCartProducts));
      },
      error: (error) => {
        console.error('❌ Error fetching user cart:', error);
      },
    });
  }
}

