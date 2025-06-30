import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgToastService } from 'ng-angular-popup';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.css',
})
export class RelatedProductsComponent implements OnInit {
  @Input() category: string = 'All';

  products: any = [];
  token: any;
  groupedProducts: any;

  wishlistProducts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private _toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.loadProducts(this.category);
  }

  loadProducts(category: string): void {
    const handleProductData = (data: any) => {
      this.products = data.products || data;
      console.log('Loaded products:', this.products);

      const tagGroupsMap: { [key: string]: any[] } = {};

      this.products.forEach((product: any) => {
        const tag = product.tags?.trim(); // handle empty or missing tags
        if (tag) {
          if (!tagGroupsMap[tag]) {
            tagGroupsMap[tag] = [];
          }
          tagGroupsMap[tag].push(product);
        }
      });

      const groupedByTags = Object.entries(tagGroupsMap).map(
        ([tag, products]) => ({
          tags: tag,
          products: products,
        })
      );

      console.log('Grouped by tags:', groupedByTags);

      // Optional: store in a class property for UI use
      this.groupedProducts = groupedByTags;
    };

    if (!category || category === 'All') {
      this.productService.getAllProducts().subscribe({
        next: handleProductData,
        error: (error) => {
          console.error('Error fetching all products:', error);
        },
      });
    } else {
      this.productService.getProductsByCategory(category).subscribe({
        next: handleProductData,
        error: (error) => {
          console.error('Error fetching products:', error);
        },
      });
    }
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
}
