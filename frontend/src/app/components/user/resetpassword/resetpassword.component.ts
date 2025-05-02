import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  token!: string;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';

    this.resetPasswordForm = this.fb.group({
      newpassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) return;

    this.isSubmitting = true;
    const newPassword = this.resetPasswordForm.value.newpassword;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        alert('Password updated successfully!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Something went wrong!';
        this.isSubmitting = false;
      }
    });
  }
}
