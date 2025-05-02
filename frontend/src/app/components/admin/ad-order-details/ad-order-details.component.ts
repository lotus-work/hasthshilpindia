import { Component } from '@angular/core';
import { AdminOrdersService } from '../../../services/admin.orders/admin-orders.service';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-ad-order-details',
  templateUrl: './ad-order-details.component.html',
  styleUrls: ['./ad-order-details.component.css'],
})
export class AdOrderDetailsComponent {
  order: any;
  orderId: string | null = null;
  errorMessage: string | null = null;
  orderStatusOptions: string[] = [
    'Pending',
    'Ordered',
    'Processing',
    'Processed',
    'Shipped',
    'Out_For_Delivery',
    'Delivered',
    'Failed',
    'Refund_Initiated',
    'Refunded'
  ];

  constructor(
    private adminOrderService: AdminOrdersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.fetchOrder(this.orderId);
    }
  }

  fetchOrder(orderId: string): void {
    this.adminOrderService.getOrderById(orderId).subscribe(
      (data) => {
        this.order = data.orders;
      },
      (error) => {
        this.errorMessage = 'Failed to fetch order. Please try again.';
      }
    );
  }

  updateOrderStatus(status: string): void {
    if (!this.orderId) return;
    this.adminOrderService.updateOrderStatus(this.orderId, status).subscribe(
      () => {
        this.order.orderStatus = status;
      },
      (error) => {
        console.error('Error updating order status:', error);
      }
    );
  }

  cancelOrder(): void {
    // if (!this.orderId) return;
    // this.adminOrderService.cancelOrder(this.orderId).subscribe(
    //   () => {
    //     this.order.orderStatus = 'Cancelled';
    //   },
    //   (error) => {
    //     console.error('Error cancelling order:', error);
    //   }
    // );
  }
  getVariantTitles(color: any[]): string {
    return color?.map(c => c.title).join(', ') || '';
  }

  downloadReceipt(order: any) {
    const doc = new jsPDF('p', 'mm', 'a4');
  
    const receiptHTML = `
      <div id="receipt-content" style="width: 210mm; font-family: Arial, sans-serif; font-size: 12px; color: #000; box-sizing: border-box; padding: 0; margin: 0;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="../../../../assets/img/logo.svg" alt="Hasthshilp Logo" style="max-height: 60px; margin-bottom: 5px;" />
          <h1 style="font-size: 20px; color: #333;">Hasthshilp</h1>
        </div>
        <div style="padding: 20px;">
          <div style="border: 1px solid #ccc; padding: 15px;">
            <h5 style="background: #333; color: white; padding: 10px;">Order Details</h5>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Total Price:</strong> ₹${order.totalPriceAfterDiscount.toLocaleString('en-IN')}</p>
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
                    <td style="padding: 8px; border: 1px solid #ddd;">₹${item.price.toLocaleString('en-IN')}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">₹${(item.quantity * item.price).toLocaleString('en-IN')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div style="text-align: right; margin-top: 10px; font-weight: bold;">Grand Total: ₹${order.totalPriceAfterDiscount.toLocaleString('en-IN')}</div>
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
  
    // Create hidden container
    const receiptContainer = document.createElement('div');
    receiptContainer.innerHTML = receiptHTML;
    receiptContainer.style.position = 'absolute';
    receiptContainer.style.left = '-9999px';
    receiptContainer.style.top = '0';
    receiptContainer.style.background = '#fff'; // white background
    document.body.appendChild(receiptContainer);
  
    html2canvas(receiptContainer, {
      scale: 2,
      scrollY: 0,
      scrollX: 0,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: document.body.scrollWidth,
      windowHeight: receiptContainer.scrollHeight
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save(`Receipt_${order._id}.pdf`);
  
      document.body.removeChild(receiptContainer);
    });
  }
  
  
}

