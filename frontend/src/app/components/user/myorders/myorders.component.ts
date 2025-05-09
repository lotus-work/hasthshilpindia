import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { handleSessionExpiration } from '../../../session-utils';
import { Router } from '@angular/router';
@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrl: './myorders.component.css'
})
export class MyordersComponent {
  userCart: any;
  userCartProducts: any;
  userData: any = {};
  token : any;
  userOrders: any[] = [];
  expandedOrderIndex: number | null = null;
 constructor(private authService: AuthService,  private router: Router) {}

 ngOnInit(): void {

  const cartData = localStorage.getItem('userCart') ?? '[]';
  this.userCart = JSON.parse(cartData);
  console.log(this.userCart);
  this.userCartProducts = this.userCart.length;


  const storedUser = localStorage.getItem('customer');
  if (storedUser) {
    this.userData = JSON.parse(storedUser);
  }
  this.token = this.userData.token;
  handleSessionExpiration(this.token, this.router);
  this.fetchOrders();
}

fetchOrders(): void {
  this.authService.getMyOrders(this.token).subscribe(
    (response) => {
      this.userOrders = response.orders; // Store the orders data
      console.log('Orders:', this.userOrders);
    },
    (error) => {
      console.error('Error fetching orders:', error);
    }
  );
}

toggleOrderDetails(index: number) {
  this.expandedOrderIndex = this.expandedOrderIndex === index ? null : index;
}

 /**
   * Function to generate and download receipt as PDF
   */
 downloadReceipt(order: any) {
  const doc = new jsPDF('p', 'mm', 'a4');

  const receiptHTML = `
    <div style="width: 100%; font-family: Arial, sans-serif; font-size: 12px; padding: 20px; color: #000; box-sizing: border-box;">
      <!-- Top Header with Logo and Title -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="../../../../assets/img/logo.svg" alt="Hasthshilp Logo" style="max-height: 60px; margin-bottom: 5px;" />
        <h1 style="margin-left: 15px; font-size: 20px; color: #333;">Hasthshilp</h1>
      </div>
    <div style="width: 100%; font-family: Arial, sans-serif; font-size: 12px; padding: 20px; color: #000;">
      <div style="border: 1px solid #ccc; padding: 15px;">
        <h5 style="background: #333; color: white; padding: 10px;">Order Details</h5>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Total Price:</strong> ₹${order.totalPriceAfterDiscount}</p>
        <p><strong>Order Status:</strong> ${order.orderStatus}</p>

        <hr style="margin: 20px 0;">

        <div style="display: flex; justify-content: space-between;">
          <div>
            <h5 style="color: #007BFF;">Customer Details</h5>
            <p><strong>Id:</strong> ${order.user?._id || 'N/A'}</p>
            <p><strong>Name:</strong> ${order.user?.firstname} ${order.user?.lastname}</p>
            <p><strong>Email:</strong> ${order.user?.email || 'N/A'}</p>
            <p><strong>Mobile:</strong> ${order.user?.mobile}</p>
          </div>
          <div>
            <h5 style="color: #007BFF;">Shipping Address</h5>
            <p><strong>Address:</strong> ${order.shippingInfo?.address}</p>
            <p><strong>Landmark:</strong> ${order.shippingInfo?.other}</p>
            <p><strong>City:</strong> ${order.shippingInfo?.city}</p>
            <p><strong>State:</strong> ${order.shippingInfo?.state}</p>
            <p><strong>Pincode:</strong> ${order.shippingInfo?.pincode}</p>
            <p><strong>Country:</strong> India</p>
          </div>
        </div>

        <hr style="margin: 20px 0;">

        <h5 style="color: #007BFF;">Order Items</h5>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd;">Product</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Variants</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.orderItems.map((item: any) => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.product?.title || ''}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${this.getVariantTitles(item.color)}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">₹${item.price}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">₹${item.quantity * item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right; margin-top: 10px; font-weight: bold;">Grand Total: ₹${order.totalPriceAfterDiscount}</div>

        <hr style="margin: 20px 0;">

        <h5 style="color: #007BFF;">Payment Information</h5>
        <p><strong>Order ID:</strong> ${order.paymentInfo?.razorpayOrderId || 'N/A'}</p>
        <p><strong>Payment ID:</strong> ${order.paymentInfo?.razorpayPaymentId || 'N/A'}</p>
      </div>

      <div style="margin-top: 5px; padding-top: 10px; border-top: 1px solid #ccc; text-align: center;">
        <p>Email: support@hasthshilp.com</p>
        <p>Phone: +91 9027700914</p>
      </div>
    </div>
    </div>
  `;

  // Convert HTML to canvas and export as PDF
  const receiptContainer = document.createElement('div');
  receiptContainer.innerHTML = receiptHTML;
  document.body.appendChild(receiptContainer);

  html2canvas(receiptContainer).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    doc.save(`Receipt_${order._id}.pdf`);

    document.body.removeChild(receiptContainer);
  });
}


getVariantTitles(color: any[]): string {
  return color?.map(c => c.title).join(', ') || '';
}
}
