import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersService {

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

   getAllOrders(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/user/getallorders`, {
        headers: this.getHeaders(),
      });
    }

    getOrderAnalytics(year: number): Observable<any> {
    
      const headers = new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      });
  
      return this.http.get<any>(`${this.apiUrl}/user/getOrderAnalytics?year=${year}`, {
        headers: this.getHeaders(),
      });
    }


    getRecentOrder(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/user/getRecentOrders`, {
        headers: this.getHeaders(),
      });
    }

    getOrderById(orderId: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/user/getaOrder/${orderId}`, {
        headers: this.getHeaders(),
      });
    }

    updateOrderStatus(orderId: string, status: string): Observable<any> {
      const body = { status };
      return this.http.put<any>(`${this.apiUrl}/user/updateOrder/${orderId}`, body, {
        headers: this.getHeaders(),
      });
    }
}
