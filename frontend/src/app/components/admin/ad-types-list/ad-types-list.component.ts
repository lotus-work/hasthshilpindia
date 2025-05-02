import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { AdminProductsService } from '../../../services/admin.products/admin-products.service';
import { color } from 'html2canvas/dist/types/css/types/color';
declare var bootstrap: any; // Bootstrap CDN for modal handling

@Component({
  selector: 'app-ad-types-list',
  templateUrl: './ad-types-list.component.html',
  styleUrl: './ad-types-list.component.css'
})
export class AdTypesListComponent implements
  OnInit {

    typesList: any[] = [];
  
    // Pagination variables
    currentPage: number = 1;
    itemsPerPage: number = 15;  
    paginatedTypesList: any[] = [];
  
    selectedTypeId: string = '';
    typeTitle: string = '';
    isLoading: boolean = true;
    errorMessage: string = '';
    dtOptions: Config = {};
    selectedEnquiry: any = null;

    constructor(private adminProductService: AdminProductsService) { }
  
    ngOnInit(): void {
      this.getAllTypes();
      this.dtOptions = {
        processing: true,
        serverSide: false,
        columns: [
          { title: 'S.No'},
          { title: 'ID', data: '_id' },
          { title: 'Name', data: 'title' },
          { title: 'Action' }
        ]
      };
    }
    
    getAllTypes(): void {
      this.adminProductService.getColor().subscribe({
        next: (data: any[]) => {
          this.typesList = data;
          this.updatePaginatedTypeList();
          this.isLoading = false;
          console.log(data);
        },
        error: (error: any) => {
          console.error(error);
          this.errorMessage = 'Failed to load types.';
          this.isLoading = false;
        }
      });
    }
  
    // Pagination logic
    updatePaginatedTypeList(): void {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedTypesList = this.typesList.slice(startIndex, endIndex);
    }
  
    goToPage(page: number): void {
      this.currentPage = page;
      this.updatePaginatedTypeList();
    }
  
    get totalPages(): number {
      return Math.ceil(this.typesList.length / this.itemsPerPage);
    }
  
    get pages(): number[] {
      return Array(this.totalPages).fill(0).map((_, i) => i + 1);
    }

    openUpdateModal(category: any) {
      this.selectedTypeId = category._id;
      this.typeTitle = category.title;
  
      let updateModal = new bootstrap.Modal(document.getElementById('updateTypeModal'));
      updateModal.show();
    }
  
    updateType() {
      console.log();
      if (!this.selectedTypeId || !this.typeTitle.trim()) return;
  
      this.adminProductService.updateColor(this.selectedTypeId, this.typeTitle).subscribe({
        next: () => {
          alert("Varient updated successfully!")
          window.location.reload();
        },
        error: (err) => {
          alert("Error updating varient : " +  err)
          console.error('Error updating varient', err);
        }
      });
    }
  
    deleteType(typeId: string) {
      if (confirm('Are you sure you want to delete this varient?')) {
        this.adminProductService.deleteColor(typeId).subscribe({
          next: () => {
            alert("Varient Deleted")
            window.location.reload();
          },
          error: (err) => {
            alert("Error deleting varient : " +  err);
            console.error('Error deleting varient', err);
          }
        });
      }
    }
  }
  

