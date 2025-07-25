import { Component, HostListener, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() categories: any[] = [];
  @Input() cartCount: number = 0;
  @Input() allProducts: any[] = [];
  loggedIn: boolean = false;
  searchQuery: string = '';
  filteredProducts: any[] = [];
  showSearchDropdown: boolean = false;
  isProfileDropdownOpen: boolean = false;
  isHomePage: boolean = false;
  matchedCategories: any[] = [];

  constructor(public router: Router) {
    this.loggedIn =
      !!localStorage.getItem('token') && !!localStorage.getItem('customer');
    // Detect route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkIfHomePage(event.urlAfterRedirects);
      });
  }
  checkIfHomePage(url: string) {
    // Adjust conditions according to your routing ('' or '/home')
    this.isHomePage =
      url === '/' || url === '/home' || url === '' || url.includes('/catego');
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.profile-dropdown-container')) {
      this.isProfileDropdownOpen = false;
    }

    if (!target.closest('.search-container')) {
      this.showSearchDropdown = false;
    }
  }

onSearchInput() {
  const query = this.searchQuery.trim().toLowerCase();

  if (!query) {
    this.filteredProducts = [];
    this.matchedCategories = [];
    this.showSearchDropdown = false;
    return;
  }

  // Match categories
  this.matchedCategories = this.categories.filter(
    (cat) => cat?.title?.toLowerCase().includes(query)
  );

  // Match products
  this.filteredProducts = this.allProducts
    .filter(
      (product) =>
        product?.title?.toLowerCase().includes(query)
    )
    .slice(0, 5); // Limit product results

  this.showSearchDropdown = true;
}
goToCategory(category: any) {
  this.router.navigate(['/category', category.title]);
  this.searchQuery = '';
  this.filteredProducts = [];
  this.matchedCategories = [];
  this.showSearchDropdown = false;
}

  onSearchFocus() {
    this.showSearchDropdown = this.filteredProducts.length > 0;
  }

  goToProduct(product: any) {
    this.router.navigate(['/details', product._id]);
    this.searchQuery = '';
    this.filteredProducts = [];
    this.showSearchDropdown = false;
  }
}
