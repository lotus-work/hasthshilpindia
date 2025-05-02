import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  selector: 'app-ad-settings',
  templateUrl: './ad-settings.component.html',
  styleUrl: './ad-settings.component.css'
})
export class AdSettingsComponent implements OnInit {
  
  pageSettings = {

    termsOfService:  "",
    aboutUs: "",
    privacyPolicy:  "",
    updatedBy:  "",
    returnAndRefundPolicy:  "",
    shippingPolicy:  ""
  };
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image']
    ]
  };  isDragging = false;
  constructor(
    private adminService: AdminService,  
    private spinner: NgxSpinnerService,
    private _toast: NgToastService
  ) {}

  ngOnInit(): void {
    // Retrieve user ID from local storage and assign it to updatedBy
    const userData = JSON.parse(localStorage.getItem('admin') || '{}');
    this.pageSettings.updatedBy = userData._id || ''; // Adjust to match the correct ID property in local storage

    // Fetch existing page settings and populate the form
    this.getPageSettings();
  }

  // Method to fetch page settings
  getPageSettings(): void {
    this.spinner.show();
    this.adminService.getPageSettings('all').subscribe(
      (response) => {
        this.spinner.hide();
        if (response.isSuccessful && response.result) {
          this.pageSettings = { ...this.pageSettings, ...response.result }; // Merge with existing values
        }
      },
      (error) => {
        this.spinner.hide();
        this._toast.error({ detail: "ERROR", summary: 'Error fetching page settings', position: 'br' });
      }
    );
  }

  // Check if all fields have values
  allFieldsFilled(): boolean {
    return (
      this.pageSettings.aboutUs.trim() !== '' &&
      this.pageSettings.termsOfService.trim() !== '' &&
      this.pageSettings.privacyPolicy.trim() !== ''
    );
  }

  // Method to update page settings
  updatePageSettings(): void {
    this.spinner.show();

    
  const cleanedSettings = {
    ...this.pageSettings,
    aboutUs: this.pageSettings.aboutUs.replace(/&nbsp;/g, ' '),
    termsOfService: this.pageSettings.termsOfService.replace(/&nbsp;/g, ' '),
    privacyPolicy: this.pageSettings.privacyPolicy.replace(/&nbsp;/g, ' '),
    shippingPolicy: this.pageSettings.shippingPolicy.replace(/&nbsp;/g, ' '),
    returnAndRefundPolicy: this.pageSettings.returnAndRefundPolicy.replace(/&nbsp;/g, ' ')
  };

    console.log(cleanedSettings);
    this.adminService.updatePageSettings(cleanedSettings).subscribe(
      (response) => {
        this.spinner.hide();
        if (response.isSuccessful) {
          this._toast.success({ detail: "SUCCESS", summary: 'Page settings updated successfully!', position: 'br' });
        }
      },
      (error) => {
        this.spinner.hide();
        this._toast.error({ detail: "ERROR", summary: 'Error updating page settings', position: 'br' });
      }
    );
  }
}