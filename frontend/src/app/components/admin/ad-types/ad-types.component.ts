import { Component } from '@angular/core';
import { AdminProductsService } from '../../../services/admin.products/admin-products.service';

@Component({
  selector: 'app-ad-types',
  templateUrl: './ad-types.component.html',
  styleUrl: './ad-types.component.css'
})
export class AdTypesComponent {
  typeName: string = '';
  message: string = '';

  constructor(private adminProductsService: AdminProductsService) {}

  addTypes() {
    if (!this.typeName.trim()) {
      this.message = 'Type name cannot be empty!';
      return;
    }

    this.adminProductsService.createColor(this.typeName).subscribe({
      next: (response) => {
        this.message = 'Type added successfully!';
        this.typeName = '';
      },
      error: (error) => {
        this.message = 'Failed to add type!';
        console.error(error);
      }
    });
  }
}