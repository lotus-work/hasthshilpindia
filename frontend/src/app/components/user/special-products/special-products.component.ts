import { Component, Input, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { ProductService } from '../../../services/product/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-special-products',
  templateUrl: './special-products.component.html',
  styleUrl: './special-products.component.css'
})
export class SpecialProductsComponent implements OnInit {
  @Input() special: any[] = [];
    @Input() wishlistProducts: any[] = [];
    token: any;
    constructor(
      private productService: ProductService,
      private _toast: NgToastService,
      private router: Router
    ) {}
  
    ngOnInit() {
      this.token = localStorage.getItem('token') || '';
    }
    isWishlisted(product: any): boolean {
      return this.wishlistProducts.some((item) => item._id === product._id);
    }
  
    toggleWishlist(product: any): void {

      if(this.token == ''){
        alert("Please login to add to wishlist");
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
  