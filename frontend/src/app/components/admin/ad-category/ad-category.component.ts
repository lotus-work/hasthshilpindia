import { Component } from '@angular/core';
import { AdminProductsService } from '../../../services/admin.products/admin-products.service';

@Component({
  selector: 'app-ad-category',
  templateUrl: './ad-category.component.html',
  styleUrl: './ad-category.component.css'
})
export class AdCategoryComponent {
  categoryName: string = '';
  message: string = '';

  constructor(private adminProductsService: AdminProductsService) {}

  addCategory() {
    if (!this.categoryName.trim()) {
      this.message = 'Brand name cannot be empty!';
      return;
    }

    this.adminProductsService.createCategory(this.categoryName).subscribe({
      next: (response) => {
        this.message = 'Category added successfully!';
        this.categoryName = '';
      },
      error: (error) => {
        this.message = 'Failed to add category!';
        console.error(error);
      }
    });
  }
}