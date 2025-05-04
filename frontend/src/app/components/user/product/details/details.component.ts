import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../services/product/product.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  productId: string | null = null;
  product: any = null;
  quantity: number = 1;
  userData: any = {};
  originalUserData: any = {};
  token: string = '';
  userCartProducts: any[] = [];
  productExistsInCart: boolean = false; // ✅ GLOBAL PROPERTY
  variantGroupKeys: string[] = [];
  variantGroups: { [key: string]: any[] } = {};
  selectedVariants: { [key: string]: any } = {};
  selectionError: string = '';
  selectedImage: any;
  selectedImageIndex: number = 0;
  wishlistProducts: any;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public router: Router,
       private _toast: NgToastService,
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.loadUserCart(this.token);
    this.productId = this.route.snapshot.paramMap.get('id');
    console.log('Product ID:', this.productId);

    if (this.productId) {
      this.getProductById(this.productId);
    }

    const storedUser = localStorage.getItem('customer');
    if (storedUser) {
      this.userData = JSON.parse(storedUser);
      this.originalUserData = { ...this.userData };
    }

    const wishlistData = localStorage.getItem('userWishlist');
    this.wishlistProducts = wishlistData ? JSON.parse(wishlistData) : [];
  }

  isWishlisted(product: any): boolean {
    return this.wishlistProducts.some((item: any) => item._id === product._id);
  }
  toggleWishlist(product: any): void {
    if (this.token === '') {
      alert("Please login to add to wishlist");
      this.router.navigate(['login']);
      return;
    }
  
    this.productService.toggleWishlist(product._id, this.token).subscribe(
      (response) => {
        const index = this.wishlistProducts.findIndex(
          (item: any) => item._id === product._id
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
  
        localStorage.setItem('userWishlist', JSON.stringify(this.wishlistProducts));
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
  

  setupVariantGroups() {
    console.log(this.product);
    this.variantGroups = this.groupVariantsByType(this.product?.color || []);
    this.variantGroupKeys = Object.keys(this.variantGroups);
    this.variantGroupKeys.forEach((groupKey) => {
      const variants = this.variantGroups[groupKey];
      if (variants && variants.length > 0) {
        this.selectedVariants[groupKey] = variants[0];
      }
    });

    console.log(this.selectedVariants);
  }
  missingSelections(): string[] {
    return this.variantGroupKeys.filter((key) => !this.selectedVariants[key]);
  }
  groupVariantsByType(variants: any[]): { [key: string]: any[] } {
    const groups: { [key: string]: any[] } = {};

    for (const v of variants) {
      const [type, value] = v.title.split(':').map((s: string) => s.trim());
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push({ ...v, value });
    }

    return groups;
  }

  getProductById(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (response) => {
        console.log('Product Details:', response);
        this.product = response;

        // ✅ Refresh whether product exists in cart
        this.updateProductExistsInCart();
        this.selectedImage = this.product.images[0]
        console.log(this.selectedImage);
        this.setupVariantGroups();
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      },
    });
  }

  increaseQuantity() {
    if (this.quantity < this.product?.quantity) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  makeItSelectedImage(img: any) {
    this.selectedImage = img;
    this.selectedImageIndex = this.product?.images?.indexOf(img) || 0;
  }
  
  showPreviousImage() {
    if (this.selectedImageIndex > 0) {
      this.selectedImageIndex--;
      this.selectedImage = this.product?.images[this.selectedImageIndex];
    }
  }
  
  showNextImage() {
    if (this.selectedImageIndex < this.product?.images?.length - 1) {
      this.selectedImageIndex++;
      this.selectedImage = this.product?.images[this.selectedImageIndex];
    }
  }

  buyNow() {
    if (!this.userData?.token) {
      alert('Please login to buy this product!');
      this.router.navigate(['/login']);
      return;
    }
    const missing = this.missingSelections();
    if (missing.length > 0) {
      this.selectionError = `Please select ${missing.join(', ')}`;
      return;
    }

    this.selectionError = '';

    if (this.productExistsInCart) {
      this.router.navigate(['/checkout/cart']);
    } else {
      this.addProductToCart(true);
    }
  }

  addProductToCart(buy: boolean = false) {
    if (!this.userData?.token) {
      alert('Please login to add items to cart!');
      this.router.navigate(['/login']);
      return;
    }
    const missing = this.missingSelections();
    if (missing.length > 0) {
      this.selectionError = `Please select ${missing.join(', ')}`;
      return;
    }

    this.selectionError = '';

    // ✅ Collect selected variant IDs from selectedVariants
    const selectedVariantIds: string[] = Object.values(
      this.selectedVariants || {}
    )
      .map((variant: any) => variant?._id)
      .filter((id: string) => !!id);

    console.log(selectedVariantIds);
    const cartItem = {
      productId: this.product._id,
      quantity: this.quantity,
      color: selectedVariantIds, // ← pass the array here
      price: this.product.price,
      token: this.userData.token,
    };

    this.productService
      .addToCart(
        cartItem.productId,
        cartItem.quantity,
        cartItem.color,
        cartItem.price,
        cartItem.token
      )
      .subscribe({
        next: (response) => {
          console.log('Added to cart:', response);
          alert('Product added to cart successfully!');
          this.loadUserCart(this.token);

          if (buy) {
            this.router.navigate(['/checkout/cart']);
          }
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          alert('Failed to add product to cart.');
        },
      });
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

        // Ensure each product has a quantity on load
        this.userCartProducts = this.userCartProducts.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }));

        localStorage.setItem('userCart', JSON.stringify(this.userCartProducts));

        // ✅ Refresh product existence check
        this.updateProductExistsInCart();
      },
      error: (error) => {
        console.error('❌ Error fetching user cart:', error);
      },
    });
  }

  // ✅ GLOBAL FUNCTION TO CHECK IF PRODUCT EXISTS IN CART
  updateProductExistsInCart(): void {
    if (!this.product || !this.userCartProducts.length) {
      this.productExistsInCart = false;
      return;
    }

    this.productExistsInCart = this.userCartProducts.some((cartItem) => {
      return cartItem.productId._id === this.product._id;
    });

    console.log('productExistsInCart:', this.productExistsInCart);
  }
}
