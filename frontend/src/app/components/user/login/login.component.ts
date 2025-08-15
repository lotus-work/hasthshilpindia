import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  currentYear: number = new Date().getFullYear();
  private clientId =
    '481407361526-l2pphh32lheqffn9b867ets80mdre1o8.apps.googleusercontent.com';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _toast: NgToastService
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.spinner.show();

    const loginData = {
      ...this.loginForm.value,
      authProvider: 'form',
    };

    this.authService.login(loginData).subscribe({
      next: (res) => this.handleLoginSuccess(res),
      error: () => this.handleLoginError(),
    });
  }

  private handleLoginSuccess(res: any) {
    setTimeout(() => this.spinner.hide(), 1000);
    this._toast.success({
      detail: 'SUCCESS',
      summary: 'Login successful!',
      position: 'br',
    });
    localStorage.setItem('token', res.token);
    localStorage.setItem('customer', JSON.stringify(res));
    this.router.navigate(['/']);
  }

  private handleLoginError() {
    setTimeout(() => this.spinner.hide(), 1000);
    this._toast.error({
      detail: 'FAILED',
      summary: 'Invalid credentials',
      position: 'br',
    });
    this.errorMessage = 'Invalid credentials';
  }

  signInWithGoogle(): void {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: this.clientId,
      scope: 'email profile openid',
      ux_mode: 'popup',
      callback: (tokenResponse: any) => {
        if (!tokenResponse.access_token) {
          this._toast.error({
            detail: 'FAILED',
            summary: 'Google authentication failed. Please try again.',
            position: 'br',
          });
          return;
        }

        // Fetch Google profile
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        })
          .then((res) => res.json())
          .then((userInfo) => {
            const googleData = {
              identifier: userInfo.email,
              firstname: userInfo.given_name || '',
              lastname: userInfo.family_name || '',
              authProvider: 'google',
            };

            this.spinner.show();
            this.authService.login(googleData).subscribe({
              next: (res) => this.handleLoginSuccess(res),
              error: () => this.handleLoginError(),
            });
          })
          .catch(() => {
            this._toast.error({
              detail: 'FAILED',
              summary: 'Failed to fetch Google profile.',
              position: 'br',
            });
          });
      },
    });

    client.requestAccessToken();
  }
}
