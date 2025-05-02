import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent implements OnInit {
  privacyPolicyContent: string = '';
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getPageSettings('privacyPolicy').subscribe({
      next: (response) => {
        if (response && response.result && response.result.privacyPolicy) {
          this.privacyPolicyContent = response.result.privacyPolicy;
        }
      },
      error: (error) => {
        alert('Error fetching privacy policy');
        console.error('Error fetching privacy policy:', error);
      }
    });
}
}
