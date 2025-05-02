import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';
import { Config } from 'datatables.net';

declare var $: any;

@Component({
  selector: 'app-ad-enquires',
  templateUrl: './ad-enquires.component.html',
  styleUrls: ['./ad-enquires.component.css']
})
export class AdEnquiresComponent implements OnInit {

  enquiries: any[] = [];
  statusOptions: string[] = ["Submitted", "Contacted", "In Progress", "Resolved"];
  selectedEnquiry: any = null;

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 15;
  paginatedUsers: any[] = [];
    dtOptions: Config = {};
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getAllEnquiries();

    this.dtOptions = {
      processing: true,
      serverSide: false,
      columns: [
        { title: 'S.No' },
        { title: 'Name', data: 'name' },
        { title: 'Email', data: 'email' },
        { title: 'Phone', data: 'mobile' },
        { title: 'Status' },
        { title: 'Created On', data: 'createdAt' },
        { title: 'Action' }
      ]
    };
  }

  getAllEnquiries(): void {
    this.isLoading = true;

    this.adminService.getAllEnquiry().subscribe({
      next: (data: any[]) => {
        this.enquiries = data;
        this.isLoading = false;
        this.updatePaginatedUsers();
        setTimeout(() => this.initializeDataTable(), 500);
      },
      error: (error: any) => {
        console.error(error);
        this.errorMessage = 'Failed to load enquiries.';
        this.isLoading = false;
      }
    });
  }

  updateStatus(enquiry: any): void {
    console.log(enquiry);
    this.adminService.updateEnquiryStatus(enquiry._id, enquiry.status).subscribe(response => {
      console.log('Enquiry updated:', response);
      alert('Enquiry updated');
    }, error => {
      alert('Error updating enquiry:' + error);
      console.error('Error updating enquiry:', error);
    });
  }

  openDetailsModal(enquiry: any): void {
    this.selectedEnquiry = enquiry;
    $('#enquiryDetailsModal').modal('show');
  }

  deleteEnquiry(enquiryId: string): void {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      this.adminService.deleteEnquiry(enquiryId).subscribe({
        next: () => {
          this.enquiries = this.enquiries.filter(enq => enq._id !== enquiryId);
          this.updatePaginatedUsers();
          this.destroyDataTable();
          this.initializeDataTable();
          alert('Enquiry deleted successfully.');
        },
        error: (error: any) => {
          console.error(error);
          alert('Failed to delete enquiry.');
        }
      });
    }
  }

  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUsers = this.enquiries.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }

  get totalPages(): number {
    return Math.ceil(this.enquiries.length / this.itemsPerPage);
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
