import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-ad-login',
  templateUrl: './ad-login.component.html',
  styleUrl: './ad-login.component.css'
})
export class AdLoginComponent {

    loginForm: FormGroup;
    submitted = false;
    errorMessage: string = '';
    constructor(private fb: FormBuilder, private adminAuthService: AdminService, private router: Router, private spinner: NgxSpinnerService, private _toast: NgToastService) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      });
    }

    onSubmit(): void {
      this.spinner.show();
      if (this.loginForm.valid) {
        this.adminAuthService.login(this.loginForm.value).subscribe({
          next: (res) => {
            setTimeout(() => {
           
              this.spinner.hide();
            }, 1000);
            this._toast.success({ detail: "SUCCESS", summary: 'Login successful!', position: 'br' });
            localStorage.setItem('admin_token', res.token);
            localStorage.setItem('admin', JSON.stringify(res));
            console.log('Login successful', res);
            this.router.navigate(['/admin/dashboard']);
          },
          error: (err) => {
            setTimeout(() => {
           
              this.spinner.hide();
            }, 1000);
            this._toast.error({ detail: "FAILED", summary: 'Invalid email or password', position: 'br' });
          
            this.errorMessage = 'Invalid email or password';
          }
        });
      }
    }
  }