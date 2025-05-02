import { Component } from '@angular/core';
import { AdminProductsService } from '../../../services/admin.products/admin-products.service';

@Component({
  selector: 'app-ad-brand',
  templateUrl: './ad-brand.component.html',
  styleUrl: './ad-brand.component.css'
})
export class AdBrandComponent {
  brandName: string = '';
  message: string = '';

  constructor(private adminProductsService: AdminProductsService) {}

  addBrand() {
    if (!this.brandName.trim()) {
      this.message = 'Brand name cannot be empty!';
      return;
    }

    this.adminProductsService.createBrand(this.brandName).subscribe({
      next: (response) => {
        this.message = 'Brand added successfully!';
        this.brandName = '';
      },
      error: (error) => {
        this.message = 'Failed to add brand!';
        console.error(error);
      }
    });
  }
}