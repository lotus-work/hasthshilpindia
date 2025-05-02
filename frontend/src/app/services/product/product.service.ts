import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all categories
  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category`);
  }

  // 👉 Get all products
  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product`);
  }

  // 👉 Get a single product by id
  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product/${productId}`);
  }

   // Get products by category (query param)
   getProductsByCategory(category: string): Observable<any> {
    const params = new HttpParams().set('category', category);
    return this.http.get<any>(`${this.apiUrl}/product`, { params });
  }
   // ⭐ Submit or update a product rating
   updateProductRating(prodId: string, star: number, comment: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/product/rating`;
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      prodId: prodId,
      star: star,
      comment: comment
    };

    return this.http.put<any>(url, body, { headers });
  }

   // ⭐ Add/Remove product from wishlist
   toggleWishlist(prodId: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/product/wishlist`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      prodId: prodId
    };

    return this.http.put<any>(url, body, { headers });
  }

  getUserWishlist(token: string): Observable<any> {
    const url = `${this.apiUrl}/user/wishlist`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.get<any>(url, { headers });
  }

  // ⭐ Add to cart
  addToCart(
    productId: string,
    quantity: number,
    color: string[],
    price: number,
    token: string
  ): Observable<any> {
    const url = `${this.apiUrl}/user/cart`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      productId: productId,
      quantity: quantity,
      color: color,
      price: price
    };

    return this.http.post<any>(url, body, { headers });
  }

  // ⭐ Get user cart
  getUserCart(token: string): Observable<any> {
    const url = `${this.apiUrl}/user/cart`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.get<any>(url, { headers });
  }

   // ⭐ Delete a product from the cart
   deleteProductFromCart(productId: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/user/delete-product-cart/${productId}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.delete<any>(url, { headers });
  }

  // ⭐ Update product quantity in the cart
  updateProductQuantity(productId: string, quantity: number, token: string): Observable<any> {
    const url = `${this.apiUrl}/user/update-product-cart/${productId}/${quantity}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.delete<any>(url, { headers });
  }

  emptyCart(token: string): Observable<any> {
    const url = `${this.apiUrl}/user/empty-cart`
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.delete(url, { headers });
  }
}
