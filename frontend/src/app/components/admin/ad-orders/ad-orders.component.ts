import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';
import { AdminOrdersService } from '../../../services/admin.orders/admin-orders.service';
import { Config } from 'datatables.net';
declare var $: any;
@Component({
  selector: 'app-ad-orders',
  templateUrl: './ad-orders.component.html',
  styleUrl: './ad-orders.component.css'
})
export class AdOrdersComponent implements OnInit {

  orders: any[] = [];
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
  selectedEnquiry: any = null;
  currentPage: number = 1;
  itemsPerPage: number = 15;
  paginatedOrders: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
    dtOptions: Config = {};
  constructor(private adminOrdersService: AdminOrdersService) {}

  ngOnInit(): void {
    this.getAllOrders();

    this.dtOptions = {
      processing: true,
      serverSide: false,
      columns: [
        { title: 'S.No' },
        { title: 'Name' },
        { title: 'Email' },
        { title: 'Amount', data: 'totalPrice' },
        { title: 'Date' , data: 'createdAt'},
        { title: 'Order Status' },
        { title: 'Action' }
      ]
    };
  }

  getAllOrders(): void {
    this.isLoading = true;

    this.adminOrdersService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data.orders;
        this.isLoading = false;
        this.updatepaginatedOrders();
        setTimeout(() => this.initializeDataTable(), 500);
      },
      error: (error: any) => {
        console.error(error);
        this.errorMessage = 'Failed to load orders.';
        this.isLoading = false;
      }
    });
  }

  updateStatus(order: any): void {
    this.adminOrdersService.updateOrderStatus(order._id, order.orderStatus).subscribe(response => {
      console.log('Order Status updated:', response);
      alert('Order status updated to ' + order.orderStatus);
    }, error => {
      alert('Error updating enquiry:' + error);
      console.error('Error updating enquiry:', error);
    });
  }

  openDetailsModal(enquiry: any): void {
    this.selectedEnquiry = enquiry;
    $('#orderDetailsModal').modal('show');
  }

  updatepaginatedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedOrders = this.orders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatepaginatedOrders();
  }

  get totalPages(): number {
    return Math.ceil(this.orders.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  initializeDataTable(): void {
    if (!$.fn.DataTable.isDataTable('#enquiriesTable')) {
      $('#enquiriesTable').DataTable({
        paging: false,
        searching: false,
        ordering: true
      });
    }
  }

  destroyDataTable(): void {
    if ($.fn.DataTable.isDataTable('#enquiriesTable')) {
      $('#enquiriesTable').DataTable().destroy();
    }
  }
}
