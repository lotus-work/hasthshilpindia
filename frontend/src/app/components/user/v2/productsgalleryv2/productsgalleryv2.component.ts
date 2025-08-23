import { Component, Input, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { ProductService } from '../../../../services/product/product.service';
import { firstValueFrom, forkJoin } from 'rxjs';
import { SafeHtml } from '@angular/platform-browser';
interface CategoryData {
  categoryName: string;
  rawTitle: string;
  title?: SafeHtml;
  description: string;
  image: string;
}
@Component({
  selector: 'app-productsgalleryv2',
  templateUrl: './productsgalleryv2.component.html',
  styleUrl: './productsgalleryv2.component.css',
})
export class Productsgalleryv2Component implements OnInit {
  @Input() featured: any[] = [];
  @Input() wishlistProducts: any[] = [];
  token: any;
  allProducts: any;
  groupedProductsByCategory: { category: string; products: any[] }[] = [];
  backgroundColors: string[] = ['#FAEEE0', '#FFDAA3', '#B9DCFF'];
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
      categoryName: 'Unstitched Suits',
      rawTitle: 'Craft Your <span style="color:#0464cb;">Perfect Look</span>',
      description: 'Premium unstitched suits for the designer in you',
      image: '../../../../../assets/img/categories/Suits.svg',
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
      rawTitle: '"Light Up Peace, <span style="color:#0464cb;">Breathe</span> In Tranquility."',
      description: '"Let the Aroma Guide You to Tranquility."',
      image: '../../../../../assets/img/categories/Handloom.png',
    },
    {
      categoryName: 'Purse',
      rawTitle:
        'Carry <span style="color:#0464cb;">Elegance</span> in Every Step',
      description: 'Exquisite stone purses for a touch of glam',
      image: '../../../../../assets/img/categories/handbags.svg',
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
  constructor(
    private productService: ProductService,
    private _toast: NgToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('token') || '';
    this.loadCategoriesAndProductsAsync();
  }

  async loadCategoriesAndProductsAsync(): Promise<void> {
    try {
      console.log('🚀 Fetching categories and products...');

      const result = await firstValueFrom(
        forkJoin({
          products: this.productService.getAllProducts(),
        })
      );

      this.allProducts = result.products || [];
      this.groupedProductsByCategory = this.groupProductsByCategory(
        this.allProducts
      );
      console.log('✅ All Products:', this.allProducts);
    } catch (error) {
      console.error('❌ Error fetching categories/products:', error);
    }
  }

  groupProductsByCategory(
    products: any[]
  ): { category: string; products: any[] }[] {
    const categoryMap = new Map<string, any[]>();

    for (const product of products) {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, []);
      }
      categoryMap.get(product.category)!.push(product);
    }

    const groupedArray: { category: string; products: any[] }[] = [];

    categoryMap.forEach((products, category) => {
      groupedArray.push({ category, products });
    });

    return groupedArray;
  }

  isWishlisted(product: any): boolean {
    return this.wishlistProducts.some((item) => item._id === product._id);
  }

  toggleWishlist(product: any): void {
    if (this.token == '') {
      alert('Please login to add to wishlist');
      this.router.navigate(['login']);
      return;
    }
    this.productService.toggleWishlist(product._id, this.token).subscribe(
      (response) => {
        const index = this.wishlistProducts.findIndex(
          (item) => item._id === product._id
        );

        if (index === -1) {
          this.wishlistProducts.push(product);
          this._toast.success({
            detail: 'SUCCESS',
            summary: 'Added to wishlist!!',
            position: 'br',
          });
        } else {
          this.wishlistProducts.splice(index, 1);
          this._toast.success({
            detail: 'SUCCESS',
            summary: 'Removed from wishlist',
            position: 'br',
          });
        }
      },
      (error) => {
        this._toast.error({
          detail: 'ERROR',
          summary: 'Wishlist toggle failed: ' + error,
          position: 'br',
        });
        console.error('Wishlist toggle failed:', error);
      }
    );
  }

  getCategoryImage(categoryName: string): string {
  const matchedCategory = this.categoryDetails.find(
    (cat) => cat.categoryName === categoryName
  );
  return matchedCategory?.image || '../../../../../assets/img/categories/default.svg';
}
}
