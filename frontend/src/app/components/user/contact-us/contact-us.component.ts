import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  contactForm: FormGroup;
  aboutUsContent: string = '';
  submitted = false; // Track form submission

  constructor(private fb: FormBuilder, private authService: AuthService, private adminService: AdminService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]], // Ensures 10-digit mobile
      comment: ['', Validators.required]
    });

    this.aboutUs();
  }

  aboutUs(){
    this.adminService.getPageSettings('aboutUs').subscribe({
      next: (response) => {
        if (response && response.result && response.result.aboutUs) {
          this.aboutUsContent = response.result.aboutUs;
        }
      },
      error: (error) => {
        alert('Error fetching about us');
        console.error('Error fetching about us:', error);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      console.log('Form Data:', formData);

      this.authService.submitEnquiry(formData).subscribe(
        (response) => {
          console.log('Enquiry submitted successfully:', response);
          alert('Enquiry Submitted Successfully!');
          this.contactForm.reset();
          this.submitted = false; // Reset validation on form reset
        },
        (error) => {
          console.error('Error submitting enquiry:', error);
          alert('Error Submitting Enquiry. Please Try Again.');
        }
      );
    }
  }
}
