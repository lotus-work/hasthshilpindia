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
   states: string[] = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Lakshadweep',
    'Puducherry'
  ];
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

    console.log(this.originalUserData);
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
  
saveAddress(): void {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('User not authenticated.');
    return;
  }

  const addressData = {
    city: this.userData.address.city,
    state: this.userData.address.state,
    zipcode: this.userData.address.zipcode,
    street: this.userData.address.street,
    apartment: this.userData.address.apartment
  };

  this.authService.saveAddress(addressData, token).subscribe({
    next: (res) => {
      alert('Address saved successfully!');

      // Update only address field in userData
      this.userData.address = res.address;

      // Update address in localStorage without replacing entire user
      const existingUser = JSON.parse(localStorage.getItem('customer') || '{}');
      existingUser.address = res.address;
      localStorage.setItem('customer', JSON.stringify(existingUser));
    },
    error: (err) => {
      console.error('Error saving address:', err);
      alert('Failed to save address.');
    }
  });
}



}
