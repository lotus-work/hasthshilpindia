import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { handleSessionExpiration } from '../../../session-utils';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  wishlistProducts: any[] = [];
  token: any;
  userCart: any;
  userCartProducts: any;
  constructor(
    private productService: ProductService,
      private _toast: NgToastService,
          private router: Router
  ) {}

  ngOnInit(): void {
    
    this.token = localStorage.getItem('token') || '';
    handleSessionExpiration(this.token, this.router);
    const cartData = localStorage.getItem('userCart') ?? '[]';
    this.userCart = JSON.parse(cartData);
    console.log(this.userCart);
    this.userCartProducts = this.userCart.length;

    if (this.token == '') {
      this.router.navigate(['login']);
    }
    this.getUserWishlist();

  }

  getUserWishlist(): void {
    this.productService.getUserWishlist(this.token).subscribe(
      (response) => {
        this.wishlistProducts = response.wishlist || [];
        console.log('Wishlist:', this.wishlistProducts);
      },
      (error) => {
        this._toast.error({
          detail: 'ERROR',
          summary: 'Failed to fetch wishlist',
          position: 'br',
        });
        console.error('Failed to fetch wishlist:', error);
      }
    );
  }

  removeFromWishlist(productId: string): void {
    this.productService.toggleWishlist(productId, this.token).subscribe(
      (response) => {
        // Remove product from local wishlist array
        this.wishlistProducts = this.wishlistProducts.filter(
          (product) => product._id !== productId
        );
        this._toast.info({
          detail: 'SUCCESS',
          summary: 'Item removed from wishlist!',
          position: 'br',
        });
      },
      (error) => {
        console.error('Failed to remove item from wishlist:', error);
        this._toast.error({
          detail: 'SUCCESS',
          summary: 'Failed to remove item',
          position: 'br',
        });
      }
    );
  }

  addToCart(product: any): void {
    this.router.navigate([`/details/${product._id}`]);
    console.log('Add to cart:', product);
  }
}
