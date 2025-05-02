import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { AdminProductsService } from '../../../services/admin.products/admin-products.service';
declare var bootstrap: any; // Bootstrap CDN for modal handling

@Component({
  selector: 'app-ad-category-list',
  templateUrl: './ad-category-list.component.html',
  styleUrl: './ad-category-list.component.css'
})
export class AdCategoryListComponent implements
  OnInit {

    categoryList: any[] = [];
  
    // Pagination variables
    currentPage: number = 1;
    itemsPerPage: number = 15;  
    paginatedCategoryList: any[] = [];
  
    selectedCategoryId: string = '';
    categorytitle: string = '';
    isLoading: boolean = true;
    errorMessage: string = '';
    dtOptions: Config = {};
    selectedEnquiry: any = null;

    constructor(private adminProductService: AdminProductsService) { }
  
    ngOnInit(): void {
      this.getAllCategories();
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
    
    getAllCategories(): void {
      this.adminProductService.getCategories().subscribe({
        next: (data: any[]) => {
          this.categoryList = data;
          this.updatePaginatedCategoryList();
          this.isLoading = false;
          console.log(data);
        },
        error: (error: any) => {
          console.error(error);
          this.errorMessage = 'Failed to load category.';
          this.isLoading = false;
        }
      });
    }
  
    // Pagination logic
    updatePaginatedCategoryList(): void {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedCategoryList = this.categoryList.slice(startIndex, endIndex);
    }
  
    goToPage(page: number): void {
      this.currentPage = page;
      this.updatePaginatedCategoryList();
    }
  
    get totalPages(): number {
      return Math.ceil(this.categoryList.length / this.itemsPerPage);
    }
  
    get pages(): number[] {
      return Array(this.totalPages).fill(0).map((_, i) => i + 1);
    }

    openUpdateModal(category: any) {
      this.selectedCategoryId = category._id;
      this.categorytitle = category.title;
  
      let updateModal = new bootstrap.Modal(document.getElementById('updateBrandModal'));
      updateModal.show();
    }
  
    updateCategory() {
      if (!this.selectedCategoryId || !this.categorytitle.trim()) return;
  
      this.adminProductService.updateCategory(this.selectedCategoryId, this.categorytitle).subscribe({
        next: () => {
          alert("Category updated successfully!")
          window.location.reload();
        },
        error: (err) => {
          console.error('Error updating category', err);
        }
      });
    }
  
    deleteCategory(brandId: string) {
      if (confirm('Are you sure you want to delete this category?')) {
        this.adminProductService.deleteCategory(brandId).subscribe({
          next: () => {
            this.getAllCategories();
          },
          error: (err) => {
            console.error('Error deleting category', err);
          }
        });
      }
    }
  }
  

