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

  otpSent = false;
  enteredOtp = '';
  generatedOtp = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private spinner: NgxSpinnerService, private _toast: NgToastService) {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    mobile: ['+91', [Validators.required, Validators.pattern('^\\+91[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

sendOtp(): void {
  if (this.registerForm.invalid) return;

  const { email, mobile } = this.registerForm.value;
  this.isLoading = true;
  this.spinner.show();

  this.authService.checkUserExists({ email, mobile }).subscribe({
    next: (res) => {
      if (res.exists) {
        this.spinner.hide();
        this.isLoading = false;
        this._toast.error({ detail: 'Exists', summary: res.message, position: 'br' });
        return;
      }

      // If no user exists, proceed to send OTP
      this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      const payload = {
        authorization: 'YOUR_FAST2SMS_API_KEY',
        message: `Your OTP for registration is ${this.generatedOtp}`,
        language: 'english',
        route: 'q',
        numbers: '+91' + mobile
      };

      fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': payload.authorization
        },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(response => {
          this.spinner.hide();
          this.isLoading = false;
          if (response.return) {
            this.otpSent = true;
            this._toast.success({ detail: 'OTP SENT', summary: 'OTP sent successfully.', position: 'br' });
          } else {
            this._toast.error({ detail: 'ERROR', summary: 'Failed to send OTP.', position: 'br' });
          }
        })
        .catch(() => {
          this.spinner.hide();
          this.isLoading = false;
          this._toast.error({ detail: 'ERROR', summary: 'Failed to send OTP.', position: 'br' });
        });
    },
    error: (err) => {
      this.spinner.hide();
      this.isLoading = false;
      this._toast.error({ detail: 'ERROR', summary: 'Something went wrong during pre-check.', position: 'br' });
    }
  });
}


  verifyOtp(): void {
    if (this.enteredOtp === this.generatedOtp) {
      this._toast.success({ detail: 'VERIFIED', summary: 'OTP verified successfully.', position: 'br' });
      this.onSubmit();
    } else {
      this._toast.error({ detail: 'FAILED', summary: 'Invalid OTP.', position: 'br' });
    }
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