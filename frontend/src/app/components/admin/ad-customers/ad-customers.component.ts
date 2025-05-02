import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';
import { Config } from 'datatables.net';
import { AuthService } from '../../../services/auth/auth.service';
declare var bootstrap: any; // Bootstrap CDN for modal handling

@Component({
  selector: 'app-ad-customers',
  templateUrl: './ad-customers.component.html',
  styleUrl: './ad-customers.component.css'
})
export class AdCustomersComponent implements
  OnInit {

    users: any[] = [];
  
    // Pagination variables
    currentPage: number = 1;
    itemsPerPage: number = 15;  // Change as needed
    paginatedUsers: any[] = [];
  
    isLoading: boolean = true;
    errorMessage: string = '';
    dtOptions: Config = {};
    userData: any = {}  ;
    adminToken: any ="";
    isEditing: boolean = true;
    selectedCustomerId = "";
    customerTitle = "";
    constructor(private adminService: AdminService, private authService: AuthService) { 

      this.adminToken = localStorage.getItem('admin_token');
    }
  
    ngOnInit(): void {
      this.getAllUsers();
      this.dtOptions = {
        processing: true,
        serverSide: false,
        columns: [
          { title: 'ID', data: '_id' },
          { title: 'First Name', data: 'firstname' },
          { title: 'Last Name', data: 'lastname' },
          { title: 'Email', data: 'email' },
          { title: 'Phone', data: 'mobile' },
          { title: 'Role', data: 'role' },
          { title: 'Joined On', data: 'createdAt' },
          { title: 'Action' }
        ]
      };
    }
    
    getAllUsers(): void {
      this.adminService.getAllUsers().subscribe({
        next: (data: any[]) => {
          this.users = data;
          this.updatePaginatedUsers();
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error(error);
          this.errorMessage = 'Failed to load users.';
          this.isLoading = false;
        }
      });
    }
  
    // Pagination logic
    updatePaginatedUsers(): void {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedUsers = this.users.slice(startIndex, endIndex);
    }
  
    goToPage(page: number): void {
      this.currentPage = page;
      this.updatePaginatedUsers();
    }
  
    get totalPages(): number {
      return Math.ceil(this.users.length / this.itemsPerPage);
    }
  
    get pages(): number[] {
      return Array(this.totalPages).fill(0).map((_, i) => i + 1);
    }


    openUpdateModal(user: any) {
      console.log(user);
      this.selectedCustomerId = user._id;
      this.customerTitle = user.firstname;
      this.userData = user;
      let updateModal = new bootstrap.Modal(document.getElementById('updateBrandModal'));
      updateModal.show();
    }
    updateProfile() {
     
      this.authService.editUserByAdmin(this.userData, this.adminToken).subscribe({
        next: () => {
          alert("Info updated successfully!")
          window.location.reload();
        },
        error: (err) => {
          console.error('Error updating info', err);
        }
      });
    }
  
    // deleteProfile(brandId: string) {
    //   if (confirm('Are you sure you want to delete this brand?')) {
    //     this.authService.de(brandId).subscribe({
    //       next: () => {
    //         this.loadBrands(); // Refresh list after deletion
    //       },
    //       error: (err) => {
    //         console.error('Error deleting brand', err);
    //       }
    //     });
    //   }
    // }
  }
  

