import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { AdminProductsService } from '../../../services/admin.products/admin-products.service';

declare var bootstrap: any; // Bootstrap CDN for modal handling

@Component({
  selector: 'app-ad-brand-list',
  templateUrl: './ad-brand-list.component.html',
  styleUrl: './ad-brand-list.component.css'
})
export class AdBrandListComponent implements OnInit, AfterViewInit, OnDestroy {
  brands: any[] = [];
  dtTrigger: Subject<any> = new Subject<any>();

  selectedBrandId: string = '';
  brandTitle: string = '';
  dtOptions: Config = {};
  currentPage: number = 1;
  itemsPerPage: number = 15;  
  paginatedBrands: any[] = [];
  constructor(private adminProductsService: AdminProductsService) {}

  ngOnInit() {
    
    this.loadBrands();
    this.dtOptions = {
      processing: true,
      serverSide: false,
      columns: [
        { title: 'S.No'},
        { title: 'ID', data: '_id' },
        { title: 'Brand Name', data: 'title' },
        { title: 'Created At', data: 'createdAt' }
      ]
    };
  }

  loadBrands() {
    this.adminProductsService.getBrands().subscribe({
      next: (data) => {
        this.brands = data;
        this.updatePaginatedBrands();
      },
      error: (err) => {
        console.error('Error fetching brands', err);
      }
    });
  }

  openUpdateModal(brand: any) {
    this.selectedBrandId = brand._id;
    this.brandTitle = brand.title;

    let updateModal = new bootstrap.Modal(document.getElementById('updateBrandModal'));
    updateModal.show();
  }

  updateBrand() {
    if (!this.selectedBrandId || !this.brandTitle.trim()) return;

    this.adminProductsService.updateBrand(this.selectedBrandId, this.brandTitle).subscribe({
      next: () => {
        alert("Brand updated successfully!")
        window.location.reload();
      },
      error: (err) => {
        console.error('Error updating brand', err);
      }
    });
  }

  deleteBrand(brandId: string) {
    if (confirm('Are you sure you want to delete this brand?')) {
      this.adminProductsService.deleteBrand(brandId).subscribe({
        next: () => {
          this.loadBrands(); // Refresh list after deletion
        },
        error: (err) => {
          console.error('Error deleting brand', err);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.subscribe();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // Pagination logic
  updatePaginatedBrands(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBrands = this.brands.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedBrands();
  }

  get totalPages(): number {
    return Math.ceil(this.brands.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
}