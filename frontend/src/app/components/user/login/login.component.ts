import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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
      identifier: ['', [Validators.required]], // <-- Replaces 'email'
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.spinner.show();

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        setTimeout(() => this.spinner.hide(), 1000);
        this._toast.success({ detail: "SUCCESS", summary: 'Login successful!', position: 'br' });

        localStorage.setItem('token', res.token);
        localStorage.setItem('customer', JSON.stringify(res));
        this.router.navigate(['/']);
      },
      error: () => {
        setTimeout(() => this.spinner.hide(), 1000);
        this._toast.error({ detail: "FAILED", summary: 'Invalid credentials', position: 'br' });
        this.errorMessage = 'Invalid credentials';
      }
    });
  }
}
