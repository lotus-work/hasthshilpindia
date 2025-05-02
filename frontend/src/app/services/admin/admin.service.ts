import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
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
  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/admin-login`, userData);
  }

  getAllUsers(): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    return this.http.get<any>(`${this.apiUrl}/user/all-users`, {
      headers: this.getHeaders(),
    });
  }
  getAllEnquiry(): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(`${this.apiUrl}/enquiry`, {
      headers: this.getHeaders(),
    });
  }

  updateEnquiryStatus(enquiryId: string, status: string): Observable<any> {
    const body = { status };

    return this.http.put<any>(`${this.apiUrl}/enquiry/${enquiryId}`, body, {
      headers: this.getHeaders(),
    });
  }

  deleteEnquiry(enquiryId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/enquiry/${enquiryId}`, {
      headers: this.getHeaders(),
    });
  }

  updatePageSettings(pageSettingsData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl + "/page/update"}`, pageSettingsData,{
      headers: this.getHeaders(),
    });
  }

  getPageSettings(page: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/page/update?page=${page}`,{
      headers: this.getHeaders(),
    });
  }
}
