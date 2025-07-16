import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  currentYear: number = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private _toast: NgToastService
  ) {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
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
          this.spinner.hide();
          this.isLoading = false;
          this._toast.error({
            detail: 'Exists',
            summary: res.message,
            position: 'br',
          });
          return;
        }

        // Proceed to registration
        this.authService.register(this.registerForm.value).subscribe({
          next: () => {
            this._toast.success({
              detail: 'SUCCESS',
              summary: 'Registration successful!',
              position: 'br',
            });

            this.registerForm.reset();
            this.spinner.hide();

            setTimeout(() => {
              window.location.href = '/login';
            }, 3000);
          },
          error: () => {
            this.spinner.hide();
            this._toast.error({
              detail: 'FAILED',
              summary: 'Registration failed. Please try again.',
              position: 'br',
            });
          },
          complete: () => {
            this.isLoading = false;
          },
        });
      },
      error: () => {
        this.spinner.hide();
        this.isLoading = false;
        this._toast.error({
          detail: 'ERROR',
          summary: 'Something went wrong during user check.',
          position: 'br',
        });
      },
    });
  }
}
