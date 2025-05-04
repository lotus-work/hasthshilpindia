import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminProductsService } from '../../../services/admin.products/admin-products.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-ad-edit-products',
  templateUrl: './ad-edit-products.component.html',
  styleUrl: './ad-edit-products.component.css'
})
export class AdEditProductsComponent implements OnInit {
  productId: string = '';
  product: any = {
    title: '',
    description: '',
    price: 0,
    brand: '',
    category: '',
    color: [] as string[],
    tags: '',
    quantity: 1,
    images: []
  };

  brands: any[] = [];
  categories: any[] = [];
  colors: any[] = [];
  selectedColors: any[] = [];
  isDragging = false;
  uploadError: string = '';
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image']
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminProductsService: AdminProductsService,
    private spinner: NgxSpinnerService, private _toast: NgToastService
  ) {
    
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
  
    this.adminProductsService.getBrands().subscribe(res => this.brands = res);
    this.adminProductsService.getCategories().subscribe(res => this.categories = res);
    this.adminProductsService.getColor().subscribe(res => {
      this.colors = res;
  
      // Fetch product after colors are available
      this.adminProductsService.getProductById(this.productId).subscribe({
        next: (res) => {
          this.product = res;
  
          // If color is array of objects, extract their _ids for backend use
          if (Array.isArray(this.product.color) && typeof this.product.color[0] === 'object') {
            this.selectedColors = this.product.color;
            this.product.color = this.product.color.map((c: any) => c._id);
          }
  
          console.log(this.product);
        },
        error: (err) => {
          console.error('Failed to load product', err);
          alert('Product not found.');
          this.router.navigate(['/admin/dashboard']);
        }
      });
    });
  }
  

  submitProduct() {
    this.spinner.show();
    if (!this.product.images.length) {
      setTimeout(() => {
           
        this.spinner.hide();
      }, 1000);
      this.uploadError = 'Please upload at least one image.';
      return;
    }
  
    // Ensure only IDs are sent in color
    this.product.color = this.selectedColors.map(c => c._id);
  
    this.adminProductsService.updateProduct(this.productId, this.product).subscribe({
      next: () => {
        setTimeout(() => {
           
          this.spinner.hide();
        }, 1000);
        alert('Product updated successfully!');
        // this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        setTimeout(() => {
           
          this.spinner.hide();
        }, 1000);alert('Failed to update product.')}
    });
  }

  onImageSelect(event: any) {
    const files = event.target.files;
    this.uploadImages(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) this.uploadImages(files);
  }

  uploadImages(files: FileList | File[]) {
    this.spinner.show();
    this.uploadError = '';

    Array.from(files).forEach(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 300 * 1024;

      if (!isValidType) {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
        this.uploadError = 'Only JPG and PNG files are allowed.';
        return;
      }

      if (!isValidSize) {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
        this.uploadError = 'File size must be under 400KB.';
        return;
      }

      this.adminProductsService.uploadImage(file).subscribe({
        next: (res) => {
          if (res && Array.isArray(res)) {
            res.forEach(image => {
              this.product.images.push({
                url: image.url,
                public_id: image.public_id
              });
            });
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
            this._toast.success({
              detail: 'SUCCESS',
              summary: 'Upload successful!',
              position: 'br',
            });
          }
        },
        error: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
          this._toast.error({
            detail: 'ERROR',
            summary: 'Failed to upload image',
            position: 'br',
          });

          this.uploadError = 'Failed to upload image.'}
      });
    });
  }

  removeImage(index: number): void {
    this.spinner.show();
    const image = this.product.images[index];
    if (image?.public_id) {
      this.adminProductsService.deleteImage(image.public_id).subscribe({
        next: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
          this._toast.success({
            detail: 'SUCCESS',
            summary: 'Image deleted successfully!',
            position: 'br',
          });
          this.product.images.splice(index, 1)},
        error: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
          this._toast.error({
            detail: 'ERROR',
            summary: 'Failed to delete image',
            position: 'br',
          });
          console.error('Failed to delete image.')}
      });
    } else {
      this.product.images.splice(index, 1);
    }
  }

  addColor(colorId: string) {
    const color = this.colors.find(c => c._id === colorId);
    if (color && !this.selectedColors.some(c => c._id === colorId)) {
      this.selectedColors.push(color);
      this.product.color.push(colorId);
    }
  }
  
  removeColor(colorId: string) {
    this.selectedColors = this.selectedColors.filter(c => c._id !== colorId);
    this.product.color = this.product.color.filter((id: string) => id !== colorId);
  }
  
  availableColors() {
    return this.colors.filter(c => !this.selectedColors.some(sel => sel._id === c._id));
  }
}