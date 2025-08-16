import { Component} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';

declare const google: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  currentYear: number = new Date().getFullYear();
  private clientId =
    '481407361526-l2pphh32lheqffn9b867ets80mdre1o8.apps.googleusercontent.com';


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private _toast: NgToastService,
  ) {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
    lastname: [''], 
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const { email, mobile } = this.registerForm.value;
    this.isLoading = true;
    this.spinner.show();

    this.authService.checkUserExists({ email, mobile }).subscribe({
      next: (res) => {
        if (res.exists) {
          this._toast.error({
            detail: 'FAILED',
            summary: res.message || 'User already exists.',
            position: 'br',
          });
          this.spinner.hide();
          this.isLoading = false;
          return;
        }

        const payload = { ...this.registerForm.value, authProvider: 'form' };
        this.registerUser(payload);
      },
      error: (err) => {
        this.spinner.hide();
        this.isLoading = false;
        this._toast.error({
          detail: 'ERROR',
          summary:
            err?.error?.message || 'Something went wrong during user check.',
          position: 'br',
        });
      },
    });
  }

  private registerUser(payload: any): void {
    this.authService.register(payload).subscribe({
      next: (res) => {
        if (res.status === 'fail') {
          this._toast.error({
            detail: 'FAILED',
            summary: res.message || 'Registration failed.',
            position: 'br',
          });
          this.spinner.hide();
          this.isLoading = false;
          return;
        }

        this._toast.success({
          detail: 'SUCCESS',
          summary: 'Registration successful!',
          position: 'br',
        });
        this.registerForm.reset();
        this.spinner.hide();
        this.isLoading = false;
        setTimeout(() => (window.location.href = '/login'), 3000);
      },
      error: (err) => {
        this.spinner.hide();
        this.isLoading = false;
        this._toast.error({
          detail: 'FAILED',
          summary:
            err?.error?.message || 'Registration failed. Please try again.',
          position: 'br',
        });
      },
    });
  }

signUpWithGoogle(): void {
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

      // Fetch user info directly from Google using the access token
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      })
        .then(res => res.json())
        .then(userInfo => {
          const payload = {
            firstname: userInfo.given_name,
            lastname: userInfo.family_name,
            email: userInfo.email,
            authProvider: 'google',
          };
          this.registerUser(payload);
        })
        .catch(err => {
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


