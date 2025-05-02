import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-refund-returns',
  templateUrl: './refund-returns.component.html',
  styleUrl: './refund-returns.component.css'
})
export class RefundReturnsComponent  implements OnInit {
  returnAndRefundPolicyContent: string = '';
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getPageSettings('returnAndRefundPolicy').subscribe({
      next: (response) => {
        if (response && response.result && response.result.returnAndRefundPolicy) {
          this.returnAndRefundPolicyContent = response.result.returnAndRefundPolicy;
        }
      },
      error: (error) => {
        alert('Error fetching return and refund policy');
        console.error('Error fetching return and refund policy:', error);
      }
    });
}
}
