import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminProductsService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('admin_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }

  // Brand CRUD operations
  createBrand(title: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/brand/`, { title }, { headers: this.getHeaders() });
  }

  updateBrand(brandId: string, title: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/brand/${brandId}`, { title }, { headers: this.getHeaders() });
  }

  deleteBrand(brandId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/brand/${brandId}`, { headers: this.getHeaders() });
  }

  getBrands(): Observable<any> {
    return this.http.get(`${this.apiUrl}/brand/`, { headers: this.getHeaders() });
  }

  // Category CRUD operations
  createCategory(title: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/category/`, { title }, { headers: this.getHeaders() });
  }

  updateCategory(categoryId: string, title: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/category/${categoryId}`, { title }, { headers: this.getHeaders() });
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/category/${categoryId}`, { headers: this.getHeaders() });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/`, { headers: this.getHeaders() });
  }

  // Color CRUD operations
  createColor(title: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/color/`, { title }, { headers: this.getHeaders() });
  }

  updateColor(typeId: string, title: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/color/${typeId}`, { title }, { headers: this.getHeaders() });
  }

  deleteColor(categoryId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/color/${categoryId}`, { headers: this.getHeaders() });
  }

  getColor(): Observable<any> {
    return this.http.get(`${this.apiUrl}/color/`, { headers: this.getHeaders() });
  }
  
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('images', file); // `images` must match the backend field name
  
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.post(`${this.apiUrl}/upload/`, formData, { headers });
  }

  deleteImage(publicId: string) {
    const token = localStorage.getItem('admin_token'); // or wherever your token is stored
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/upload/delete-img/${publicId}`, { headers });
  }
  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/product/`, product, { headers: this.getHeaders() });
  }

  updateProduct(productId: string, productData: any) {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}/product/${productId}`, productData, { headers });
  }

  getProductById(productId: string) {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get(`${this.apiUrl}/product/${productId}`, { headers });
  }

  getAllProducts() {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get(`${this.apiUrl}/product`, { headers });
  }

  deleteProduct(productId: string) {
    const token = localStorage.getItem('admin_token');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.delete(`${this.apiUrl}/product/${productId}`, { headers });
  }
}