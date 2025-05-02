import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-shipping-ploicy',
  templateUrl: './shipping-ploicy.component.html',
  styleUrl: './shipping-ploicy.component.css'
})
export class ShippingPloicyComponent implements OnInit {
  shippingPolicyContent: string = '';
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getPageSettings('shippingPolicy').subscribe({
      next: (response) => {
        if (response && response.result && response.result.shippingPolicy) {
          this.shippingPolicyContent = response.result.shippingPolicy;
        }
      },
      error: (error) => {
        alert('Error fetching shipping policy');
        console.error('Error fetching shipping policy:', error);
      }
    });
}
}
