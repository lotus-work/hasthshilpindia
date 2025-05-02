import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit {
  userData: any = {};
  originalUserData: any = {};
  isEditing: boolean = false;
  userCart: any;
  userCartProducts: any;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('customer');
    if (storedUser) {
      this.userData = JSON.parse(storedUser);
      this.originalUserData = { ...this.userData };
    }

    const cartData = localStorage.getItem('userCart') ?? '[]';
    this.userCart = JSON.parse(cartData);
    console.log(this.userCart);
    this.userCartProducts = this.userCart.length;
  }

  editProfile(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.userData = { ...this.originalUserData };
  }
  updateProfile(): void {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (!token) {
      alert('User not authenticated.');
      return;
    }
  
    this.authService.editUser(this.userData, token).subscribe({
      next: (response) => {
        localStorage.setItem('customer', JSON.stringify(this.userData));
        this.originalUserData = { ...this.userData };
        this.isEditing = false;
        alert('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
      }
    });
  }
  
}
