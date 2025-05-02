import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';
import { AdminOrdersService } from '../../../services/admin.orders/admin-orders.service';
declare var $: any;
@Component({
  selector: 'app-ad-dashboard',
  templateUrl: './ad-dashboard.component.html',
  styleUrl: './ad-dashboard.component.css'
})
export class AdDashboardComponent implements OnInit {

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

  constructor(private adminOrdersService: AdminOrdersService) {}

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders(): void {
    this.isLoading = true;

    this.adminOrdersService.getRecentOrder().subscribe({
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
