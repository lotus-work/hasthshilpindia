import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/register`, userData);
  }
  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/login`, userData);
  }
  editUser(userData: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(`${this.apiUrl}/user/edit-user`, userData, { headers });
  }
   checkUserExists(data: { email: string; mobile: string }): Observable<{ exists: boolean; message: string }> {
    return this.http.post<{ exists: boolean; message: string }>(
      `${this.apiUrl}/user/validate/exists`,
      data
    );
  }

  editUserByAdmin(userData: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(`${this.apiUrl}/user/admin/edit-user`, userData, { headers });
  }

  getMyOrders(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}/user/getmyorders`, { headers });
  }

  forgotPassword(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}/user/forgot-password-token`, { email }, { headers });
  }
  
  resetPassword(token: string, newPassword: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  
    const body = { password: newPassword };
  
    return this.http.put<any>(`${this.apiUrl}/user/reset-password/${token}`, body, { headers });
  }
  submitEnquiry(enquiryData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/enquiry`, enquiryData, { headers });
  }
}
