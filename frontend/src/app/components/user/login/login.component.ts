import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  currentYear: number = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _toast: NgToastService
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Initialize Google Identity Services
    google.accounts.id.initialize({
      client_id: '481407361526-l2pphh32lheqffn9b867ets80mdre1o8.apps.googleusercontent.com',
      callback: (response: any) => this.handleGoogleLogin(response)
    });

    // Render Google button
    google.accounts.id.renderButton(
      document.getElementById('googleLoginBtn'),
      { theme: 'outline', size: 'large', width: '100%' }
    );
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.spinner.show();

    const loginData = {
      ...this.loginForm.value,
      authProvider: 'form'
    };

    this.authService.login(loginData).subscribe({
      next: (res) => {
        this.handleLoginSuccess(res);
      },
      error: () => {
        this.handleLoginError();
      }
    });
  }

  handleGoogleLogin(response: any) {
    // Decode JWT from Google
    const payload = this.decodeJwtResponse(response.credential);

    const googleData = {
      identifier: payload.email,
      firstname: payload.given_name || '',
      lastname: payload.family_name || '',
      authProvider: 'google'
    };

    this.spinner.show();

    this.authService.login(googleData).subscribe({
      next: (res) => {
        this.handleLoginSuccess(res);
      },
      error: () => {
        this.handleLoginError();
      }
    });
  }

  private decodeJwtResponse(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  private handleLoginSuccess(res: any) {
    setTimeout(() => this.spinner.hide(), 1000);
    this._toast.success({ detail: 'SUCCESS', summary: 'Login successful!', position: 'br' });
    localStorage.setItem('token', res.token);
    localStorage.setItem('customer', JSON.stringify(res));
    this.router.navigate(['/']);
  }

  private handleLoginError() {
    setTimeout(() => this.spinner.hide(), 1000);
    this._toast.error({ detail: 'FAILED', summary: 'Invalid credentials', position: 'br' });
    this.errorMessage = 'Invalid credentials';
  }
}
