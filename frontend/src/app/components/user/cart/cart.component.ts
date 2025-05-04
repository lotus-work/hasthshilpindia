import { Component } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { Router } from '@angular/router';
import { PaymentsService } from '../../../services/payments/payments.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  quantity: number = 1;
  userCartProducts: any[] = [];

  itemTotal: number = 0;
  deliveryCharge: number = 0;
  grandTotal: number = 0;
  token: string = '';
  showCheckoutModal: boolean = false;
  showCheckoutForm = false;
  userData: any = {};
  checkoutForm: FormGroup;
  constructor(private productService: ProductService,    private _toast: NgToastService, private router: Router, private paymentsService: PaymentsService, private fb: FormBuilder) {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      address2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    const storedUser = localStorage.getItem('customer');
    if (storedUser) {
      this.userData = JSON.parse(storedUser);
    }
    this.token = this.userData.token;
    this.loadUserCart(this.token);
    localStorage.setItem('userCart', JSON.stringify(this.userCartProducts));
  }

  async increment(product: any): Promise<void> {
    if (product.quantity >= product.productId.quantity) {
      alert('Cannot add more items. Stock limit reached!');
      return;
    }

    const updatedQuantity = product.quantity + 1;

    const success = await this.updateProductQuantity(product._id, updatedQuantity);
    if (success) {
      product.quantity = updatedQuantity;
      this.updateTotal();
    } else {
      alert('Failed to update product quantity');
    }
  }

  async decrement(product: any): Promise<void> {
    if (product.quantity <= 1) {
      alert('Quantity cannot be less than 1!');
      return;
    }

    const updatedQuantity = product.quantity - 1;

    const success = await this.updateProductQuantity(product._id, updatedQuantity);
    if (success) {
      product.quantity = updatedQuantity;
      this.updateTotal();
    } else {
      alert('Failed to update product quantity');
    }
  }

  updateProductQuantity(productId: string, quantity: number): Promise<boolean> {
    return new Promise((resolve) => {
      if (quantity < 1) {
        console.warn('Quantity must be at least 1');
        resolve(false);
        return;
      }

      this.productService.updateProductQuantity(productId, quantity, this.token).subscribe({
        next: (res) => {
          console.log('✅ Product quantity updated:', res);
          resolve(true);
        },
        error: (err) => {
          console.error('❌ Failed to update product quantity:', err);
          resolve(false);
        }
      });
    });
  }

  deleteProductFromCart(cartItemId: string): void {
    this.productService.deleteProductFromCart(cartItemId, this.token).subscribe({
      next: (res) => {
        console.log('✅ Product removed from cart:', res);
        this.loadUserCart(this.token);
        localStorage.setItem('userCart', JSON.stringify(this.userCartProducts));
      },
      error: (err) => {
        console.error('❌ Failed to delete product from cart:', err);
      }
    });
  }
  clearForm() {
    this.checkoutForm.reset();
  }
  viewProductDetails(productId: string) {
    this.router.navigate(['/details', productId]);
  }

  updateTotal(): void {
    this.itemTotal = this.userCartProducts.reduce((acc, item) => {
      return acc + item.productId.price * item.quantity;
    }, 0);

    this.grandTotal = this.itemTotal + this.deliveryCharge;
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
        this.userCartProducts = this.userCartProducts.map(item => ({
          ...item,
          quantity: item.quantity || 1
        }));

        const outOfStockItems = this.userCartProducts.filter(item =>
          item.quantity === 0 || item.productId?.quantity === 0
        );

        if(outOfStockItems){
          outOfStockItems.forEach(item => {
            this.deleteProductFromCart(item._id);
          });
        }

        this.updateTotal();
        localStorage.setItem('userCart', JSON.stringify(this.userCartProducts));
      },
      error: (error) => {
        console.error('❌ Error fetching user cart:', error);
      }
    });
  }

  openCheckoutModal() {
    this.showCheckoutModal = true;
  }
  
  closeCheckoutModal() {
    this.showCheckoutModal = false;
  }

  checkout() {
    const orderGrandTotal = { amount: this.grandTotal };

    this.paymentsService.checkout(orderGrandTotal).subscribe(
      (response: any) => {
        console.log('Order Checkout Response:', response);
        alert('Order successfully created!');
        this.openRazorpay(response.order);
      },
      (error) => {
        console.error('Error in checkout:', error);
        alert('Checkout failed!');
      }
    );
  }

  formatShippingInfo(formValues: any) {
    return {
      firstname: formValues.firstName,
      lastname: formValues.lastName,
      address: formValues.address,
      state: formValues.state,
      city: formValues.city,
      country: "India", // Hardcoded, change as needed
      pincode: formValues.zipcode,
      other: formValues.address2 // Can be used for additional details
    };
  }

  formatOrderItems(userCartProducts: any[]) {
    console.log(userCartProducts);
    return userCartProducts.map(product => ({
      product: product.productId._id,
      quantity: product.quantity,
      color: product.color.map((c: any) => c._id), // extract array of _id
      price: product.price
    }));
  }

  createOrder(paymentData: any, orderDetails: any) {
    console.log(orderDetails);
    const orderData = {
      totalPrice: orderDetails.amount,
      totalPriceAfterDiscount: orderDetails.amount_due || orderDetails.amount,
      orderItems: this.formatOrderItems(this.userCartProducts),
      paymentInfo: {
        razorpayOrderId: paymentData.razorpayOrderId,
        razorpayPaymentId: paymentData.razorpayPaymentId
      },
      shippingInfo: this.formatShippingInfo(this.checkoutForm.value)
    };
  
    this.paymentsService.createOrder(orderData).subscribe(
      (response: any) => {

        this.productService.emptyCart(this.token).subscribe({
          next: () => {
            this.userCartProducts = [];
            localStorage.setItem('userCart', JSON.stringify([]));
           this.router.navigate(['/myorders']);
          },
          error: (err) => {
            console.error('❌ Error emptying cart:', err);
          }
        });
        console.log('Order Created successfully:', response);

      },
      (error) => {
        alert("Failed! Can't create your order");
        this.router.navigate(['/myorders']);
        console.error('Error creating order:', error);
      }
    );
  }
  

  // Method to verify payment
  verifyPayment(paymentInfo: any, order: any) {
    const paymentVerify = {
      orderCreationId : paymentInfo.razorpay_order_id,
      razorpayPaymentId : paymentInfo.razorpay_payment_id,
      razorpayOrderId : paymentInfo.razorpay_order_id
    }
    this.paymentsService.verifyPayment(paymentVerify).subscribe(
      (response) => {
        console.log('Payment Verified:', response);
        console.log("Order ", order);
        alert('Payment successful!');

        this.createOrder(paymentVerify, order);
      },
      (error) => {
        console.error('Payment verification failed:', error);
        alert('Payment verification failed');
      }
    );
  }

  loadRazorpayScript() {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
  
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        console.error('Razorpay SDK failed to load.');
        resolve(false);
      };
  
      document.body.appendChild(script);
    });
  }
  
  async openRazorpay(order: any) {
    console.log("Opening Razorpay...");
    
    // Ensure Razorpay is loaded before initializing it
    const loaded = await this.loadRazorpayScript();
    if (!loaded) {
      alert('Failed to load Razorpay SDK.');
      return;
    }
  
    const options = {
      key: 'rzp_live_eAFTtUTOFdUQoi',
      amount: order.amount,
      currency: order.currency,
      name: 'Hasthshilp',
      description: "India's first National Award-winning marketplace that connects artisans and weavers directly with global consumers, ensuring fair prices, authenticity, and sustainable livelihoods.",
      order_id: order.id,
      handler: (response: any) => {
        console.log('Payment Success:', response);
        this.verifyPayment(response, order);
      },
      prefill: {
        name: this.userData.firstname + this.userData.lastName,
        email: this.userData.email,
        contact: this.userData.mobile
      }
    };
  
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }
  
}
