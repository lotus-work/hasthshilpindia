import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrl: './terms-of-service.component.css'
})
export class TermsOfServiceComponent implements OnInit {
  termsOfServiceContent: string = '';
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getPageSettings('termsOfService').subscribe({
      next: (response) => {
        if (response && response.result && response.result.termsOfService) {
          this.termsOfServiceContent = response.result.termsOfService;
        }
      },
      error: (error) => {
        alert('Error fetching terms of service');
        console.error('Error fetching terms of service:', error);
      }
    });
}
}
