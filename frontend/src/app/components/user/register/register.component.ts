import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
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
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  isLoading = false;
  currentYear: number = new Date().getFullYear();
  private clientId =
    '481407361526-l2pphh32lheqffn9b867ets80mdre1o8.apps.googleusercontent.com';

  private resizeListener!: () => void;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private _toast: NgToastService,
    private ngZone: NgZone
  ) {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.initGoogleSignUp();

    // Re-render Google button on window resize
    this.resizeListener = () => this.renderGoogleBtn();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
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

  initGoogleSignUp(): void {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => this.handleGoogleResponse(response),
    });

    this.renderGoogleBtn();
  }

renderGoogleBtn(): void {
  const btnContainer = document.getElementById('googleBtn');
  if (!btnContainer) return;

  // Clear previous Google button
  btnContainer.innerHTML = '';

  // Get the container width
  const width = btnContainer.offsetWidth;
  console.log('Google button container width:', width);

  // Render Google button with container width
  google.accounts.id.renderButton(btnContainer, {
    theme: 'filled',      // Filled style to look like a real button
    size: 'large',        // Better height match with "Create new account"
    text: 'signup_with',  // Better wording for registration
    width: width          // Use container width directly
  });
}
  handleGoogleResponse(response: any): void {
    const token = response.credential;
    const payload = JSON.parse(atob(token.split('.')[1]));

    const userData = {
      firstname: payload.given_name,
      lastname: payload.family_name,
      email: payload.email,
      authProvider: 'google',
    };

    this.spinner.show();
    this.authService.register(userData).subscribe({
      next: (res) => {
        if (res.status === 'fail') {
          this._toast.error({
            detail: 'FAILED',
            summary: res.message || 'Google Sign-up failed.',
            position: 'br',
          });
          this.spinner.hide();
          return;
        }

        this._toast.success({
          detail: 'SUCCESS',
          summary: 'Google Sign-up successful!',
          position: 'br',
        });
        this.spinner.hide();
        this.ngZone.run(() =>
          setTimeout(() => (window.location.href = '/login'), 2000)
        );
      },
      error: (err) => {
        this.spinner.hide();
        this._toast.error({
          detail: 'FAILED',
          summary:
            err?.error?.message ||
            'Google Sign-up failed. Please try again.',
          position: 'br',
        });
      },
    });
  }
}
