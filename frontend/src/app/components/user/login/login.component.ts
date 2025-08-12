import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';


declare const google: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  errorMessage: string = '';
  currentYear: number = new Date().getFullYear();
  private clientId =
    '481407361526-l2pphh32lheqffn9b867ets80mdre1o8.apps.googleusercontent.com';
  private resizeListener!: () => void;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _toast: NgToastService,
    private ngZone: NgZone,
      private route: ActivatedRoute,
  ) {
    
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

ngOnInit(): void {
  const reloaded = this.route.snapshot.queryParamMap.get('reload');
  
  if (!reloaded) {
    this.router.navigate([], {
      queryParams: { reload: '1' },
      queryParamsHandling: 'merge'
    }).then(() => {
      location.reload();
    });
    return;
  }

  this.initGoogleLogin();
  this.resizeListener = () => this.renderGoogleBtn();
  window.addEventListener('resize', this.resizeListener);
}

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.spinner.show();

    const loginData = {
      ...this.loginForm.value,
      authProvider: 'form'
    };

    this.authService.login(loginData).subscribe({
      next: (res) => this.handleLoginSuccess(res),
      error: () => this.handleLoginError()
    });
  }

   initGoogleLogin(): void {
  google.accounts.id.initialize({
    client_id: this.clientId,
    callback: (response: any) => this.handleGoogleLogin(response),
    auto_select: false,   // ❌ Don't auto-select existing account
    prompt_parent_id: "googleBtn", // Optional: restrict prompt to a container
    cancel_on_tap_outside: true,   // Optional: closes if user clicks outside
    ux_mode: "popup"      // Avoid full-page redirect
  });


    this.renderGoogleBtn();
  }

  private renderGoogleBtn(): void {
    const btnContainer = document.getElementById('googleLoginBtn');
    if (!btnContainer) return;

    btnContainer.innerHTML = ''; // Clear previous button
    const width = btnContainer.offsetWidth;

    google.accounts.id.renderButton(btnContainer, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      width: width
    });
  }

  private handleGoogleLogin(response: any): void {
    const payload = this.decodeJwtResponse(response.credential);

    const googleData = {
      identifier: payload.email,
      firstname: payload.given_name || '',
      lastname: payload.family_name || '',
      authProvider: 'google'
    };

    this.spinner.show();

    this.authService.login(googleData).subscribe({
      next: (res) => this.handleLoginSuccess(res),
      error: () => this.handleLoginError()
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
