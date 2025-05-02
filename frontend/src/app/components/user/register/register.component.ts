import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  currentYear: number = new Date().getFullYear();
  
  constructor(private fb: FormBuilder, private authService: AuthService, private spinner: NgxSpinnerService, private _toast: NgToastService) {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.spinner.show();

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        setTimeout(() => {
         
          this.spinner.hide();
        }, 1000);
        this._toast.success({ detail: "SUCCESS", summary: 'Registration successful!', position: 'br' });
        this.registerForm.reset();
      },
      error: (error) => {
        setTimeout(() => {
         
          this.spinner.hide();
        }, 1000);
        this._toast.error({ detail: "FAILED", summary: 'Registration failed. Please try again.', position: 'br' });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}