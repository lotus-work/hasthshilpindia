import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../../../services/product/product.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  categories: any[] = [];
  products: any[] = []; // For ngFor binding
  selectedCategory: string = ''; // Currently selected category ('' means All)

  selectedSortOption: string = '';
  priceFrom: number | null = null;
  priceTo: number | null = null;

  tagFilters = {
    special: false,
    popular: false,
    featured: false
  };

  // Defaults to use in clearAllFilters()
  readonly defaultFilters = {
    category: '',
    sortOption: '',
    priceFrom: null,
    priceTo: null,
    tags: {
      special: false,
      popular: false,
      featured: false
    }
  };
  userCart: any;
  userCartProducts: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['name'] || '';
  
      // Reset tag filters to default
      this.tagFilters = {
        special: false,
        popular: false,
        featured: false
      };
  
      // Handle tag filters from URL (supports comma-separated values)
      const tagFromUrl = params['tags'];
      if (tagFromUrl) {
        const tagArray = tagFromUrl.split(',').map((tag: string) => tag.trim());
        (['special', 'popular', 'featured'] as (keyof typeof this.tagFilters)[]).forEach(tag => {
          if (tagArray.includes(tag)) {
            this.tagFilters[tag] = true;
          }
        });
      }
  
      // Load products after setting category and filters
      this.loadProducts(this.selectedCategory);
  
      // Optionally apply filters if any tag was passed
      if (tagFromUrl) {
        this.applyFilters();
      }
    });
  
    const cartData = localStorage.getItem('userCart') ?? '[]';
    this.userCart = JSON.parse(cartData);
    console.log(this.userCart);
    this.userCartProducts = this.userCart.length;
  }
  

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categories:', this.categories);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  loadProducts(category: string): void {
    if (!category || category === 'All') {
      this.productService.getAllProducts().subscribe({
        next: (data) => {
          this.products = data.products || data;
          console.log('All products:', this.products);
        },
        error: (error) => {
          console.error('Error fetching all products:', error);
        }
      });
    } else {
      this.productService.getProductsByCategory(category).subscribe({
        next: (data) => {
          this.products = data.products || data;
          console.log('Products for category:', category, this.products);
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        }
      });
    }
  }

  selectCategory(categoryTitle: string): void {
    this.selectedCategory = categoryTitle;

    if (!categoryTitle || categoryTitle === 'All') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        queryParamsHandling: ''
      });
      this.loadProducts('');
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { name: categoryTitle },
        queryParamsHandling: 'merge'
      });
      this.loadProducts(categoryTitle);
    }
  }

  applyFilters(): void {
    const categoryIsAll = this.selectedCategory === 'All' || !this.selectedCategory;
    const anyTagSelected = this.tagFilters.special || this.tagFilters.popular || this.tagFilters.featured;

    let productFetch$;

    if (anyTagSelected) {
      productFetch$ = this.productService.getAllProducts();
    } else if (!categoryIsAll) {
      productFetch$ = this.productService.getProductsByCategory(this.selectedCategory);
    } else {
      productFetch$ = this.productService.getAllProducts();
    }

    productFetch$.subscribe({
      next: (data) => {
        let filteredProducts = data.products || data;

        // Filter by price range
        if (this.priceFrom !== null) {
          filteredProducts = filteredProducts.filter((p: any) => p.price >= this.priceFrom!);
        }
        if (this.priceTo !== null) {
          filteredProducts = filteredProducts.filter((p: any) => p.price <= this.priceTo!);
        }

        // Filter by tags
        if (anyTagSelected) {
          filteredProducts = filteredProducts.filter((product: any) => {
            let include = false;

            if (this.tagFilters.special && (product.tags?.includes('special'))) {
              include = true;
            }
            if (this.tagFilters.popular && (product.tags?.includes('popular'))) {
              include = true;
            }
            if (this.tagFilters.featured && (product.tags?.includes('featured'))) {
              include = true;
            }

            return include;
          });
        }

        // Sort products
        switch (this.selectedSortOption) {
          case 'az':
            filteredProducts.sort((a: any, b: any) => a.title.localeCompare(b.title));
            break;
          case 'za':
            filteredProducts.sort((a: any, b: any) => b.title.localeCompare(a.title));
            break;
          case 'lowToHigh':
            filteredProducts.sort((a: any, b: any) => a.price - b.price);
            break;
          case 'highToLow':
            filteredProducts.sort((a: any, b: any) => b.price - a.price);
            break;
        }

        this.products = filteredProducts;
      },
      error: (error) => {
        console.error('Error applying filters:', error);
      }
    });
  }

  /**
   * Clears only the price filters and reapplies the filter logic.
   */
  clearPriceFilter(): void {
    this.priceFrom = this.defaultFilters.priceFrom;
    this.priceTo = this.defaultFilters.priceTo;
    this.applyFilters();
  }

  /**
   * Clears all filters (category, price, tags, sorting) and resets product list.
   */
  clearAllFilters(): void {
    // Reset everything to default
    this.selectedCategory = this.defaultFilters.category;
    this.selectedSortOption = this.defaultFilters.sortOption;
    this.priceFrom = this.defaultFilters.priceFrom;
    this.priceTo = this.defaultFilters.priceTo;
    this.tagFilters = { ...this.defaultFilters.tags };

    // Reset the URL query params (optional)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: ''
    });

    // Fetch all products after clearing
    this.loadProducts('');
  }
}
