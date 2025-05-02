import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
private apiUrl = environment.apiUrl;

 constructor(private http: HttpClient) {}

 // Helper method to get headers with Authorization
 private getHeaders() {
   const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
   return new HttpHeaders({
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   });
 }

 // Method to create an order
 createOrder(orderData: any) {
   return this.http.post(`${this.apiUrl}/user/cart/create-order`, orderData, { headers: this.getHeaders() });
 }

 checkout(orderData: any) {
  return this.http.post(`${this.apiUrl}/user/order/checkout`, orderData, { headers: this.getHeaders() });
}


 // Method to verify payment
 verifyPayment(paymentData: any) {
   return this.http.post(`${this.apiUrl}/user/order/paymentVerification`, paymentData, { headers: this.getHeaders() });
 }

}
