import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { handleSessionExpiration } from '../../../session-utils';
import { Router } from '@angular/router';

   declare let html2pdf: any;
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

async downloadReceipt(order: any) {
  const wrapper = document.createElement('div');
  wrapper.style.width = '800px';
  wrapper.style.padding = '20px';
  wrapper.style.fontFamily = 'Arial, sans-serif';
  wrapper.style.fontSize = '12px';
  wrapper.style.color = '#000';
  wrapper.style.backgroundColor = '#fff';
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  wrapper.style.left = '0';
  wrapper.style.zIndex = '9999';
  wrapper.style.visibility = 'visible';
  wrapper.style.opacity = '1';

  wrapper.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <img id="receipt-logo" src="assets/img/logo.svg" alt="Hasthshilp Logo" style="max-height: 60px;" />
      <h1 style="font-size: 20px; margin: 5px 0;">Hasthshilp</h1>
    </div>
    <div style="border: 1px solid #ccc; padding: 15px;">
      <h5 style="background: #333; color: white; padding: 10px;">Order Details</h5>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Total:</strong> ₹${order.totalPriceAfterDiscount}</p>
      <p><strong>Status:</strong> ${order.orderStatus}</p>

      <hr style="margin: 20px 0;" />

      <div style="display: flex; justify-content: space-between; gap: 20px;">
        <div style="width: 50%;">
          <h5 style="color: #007BFF;">Customer</h5>
          <p><strong>Name:</strong> ${order.user?.firstname} ${order.user?.lastname}</p>
          <p><strong>Email:</strong> ${order.user?.email}</p>
          <p><strong>Mobile:</strong> ${order.user?.mobile}</p>
        </div>
        <div style="width: 50%;">
          <h5 style="color: #007BFF;">Shipping</h5>
          <p><strong>Address:</strong> ${order.shippingInfo?.address}</p>
          <p><strong>Landmark:</strong> ${order.shippingInfo?.other}</p>
          <p><strong>City:</strong> ${order.shippingInfo?.city}</p>
          <p><strong>State:</strong> ${order.shippingInfo?.state}</p>
          <p><strong>Pincode:</strong> ${order.shippingInfo?.pincode}</p>
        </div>
      </div>

      <hr style="margin: 20px 0;" />

      <h5 style="color: #007BFF;">Items</h5>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ccc; padding: 8px;">Product</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Variants</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Qty</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Price</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems.map((item: any) => `
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.product?.title}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${this.getVariantTitles(item.color)}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.quantity}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">₹${item.price}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">₹${item.price * item.quantity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 10px; font-weight: bold;">Grand Total: ₹${order.totalPriceAfterDiscount}</div>

      <hr style="margin: 20px 0;" />

      <h5 style="color: #007BFF;">Payment Info</h5>
      <p><strong>Razorpay Order ID:</strong> ${order.paymentInfo?.razorpayOrderId}</p>
      <p><strong>Payment ID:</strong> ${order.paymentInfo?.razorpayPaymentId}</p>
    </div>
  `;

  document.body.appendChild(wrapper);

  // Wait for logo image to load
  const logoImg = wrapper.querySelector('#receipt-logo') as HTMLImageElement;
  if (logoImg && !logoImg.complete) {
    await new Promise((resolve) => {
      logoImg.onload = () => resolve(true);
      logoImg.onerror = () => resolve(true);
    });
  }
  // Convert to JPG
  const canvas = await html2canvas(wrapper, { scale: 2, useCORS: true });
  const image = canvas.toDataURL('image/jpeg', 0.95);

  // 2. Convert JPG to PDF and download
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const img = new Image();
  img.src = image;

  img.onload = () => {
    const imgWidth = img.width;
    const imgHeight = img.height;
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;
    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2;

    pdf.addImage(image, 'JPEG', x, y, finalWidth, finalHeight);
    pdf.save(`Receipt_${order._id}.pdf`);

    document.body.removeChild(wrapper); // cleanup
  };
}




getVariantTitles(color: any[]): string {
  return color?.map(c => c.title).join(', ') || '';
}
}
