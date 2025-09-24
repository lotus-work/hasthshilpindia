import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product/product.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgToastService } from 'ng-angular-popup';
interface CategoryData {
  categoryName: string;
  rawTitle: string;
  title?: SafeHtml;
  description: string;
  image: string;
}
@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.css',
})
export class CategoryPageComponent implements OnInit {
  wishlistProducts: any[] = [];
  categories: any[] = [];
  products: any[] = [];
  selectedCategory: string = '';
  selectedSortOption: string = '';
  priceFrom: number | null = null;
  priceTo: number | null = null;
groupedProducts: any[] = [];
  token: any;
  tagFilters = {
    special: false,
    popular: false,
    featured: false,
  };

  readonly defaultFilters = {
    category: '',
    sortOption: '',
    priceFrom: null,
    priceTo: null,
    tags: {
      special: false,
      popular: false,
      featured: false,
    },
  };
  userCart: any;
  userCartProducts: any;
 categoryDetails: CategoryData[] = [
    {
      categoryName: 'Saree',
      rawTitle:
        'Light Up Peace, <span style="color:#0464cb;">Breathe</span> In Tranquility',
      description: 'Let the Aroma Guide You to Tranquility',
      image: '../../../../../assets/img/categories/Saree.svg',
    },
    {
      categoryName: 'Jute',
      rawTitle:
        'Eco-Friendly <span style="color:#0464cb;">Elegance</span> in Every Thread',
      description:
        'Discover sustainable style with our beautifully crafted jute products',
      image: '../../../../../assets/img/categories/jute.png',
    },
    {
      categoryName: 'Unstitched Suits',
      rawTitle: 'Craft Your <span style="color:#0464cb;">Perfect Look</span>',
      description: 'Premium unstitched suits for the designer in you',
      image: '../../../../../assets/img/categories/Suits.svg',
    },
    {
      categoryName: 'Purse',
      rawTitle:
        'Carry <span style="color:#0464cb;">Elegance</span> in Every Step',
      description: 'Exquisite stone purses for a touch of glam',
      image: '../../../../../assets/img/categories/handbags.svg',
    },
    {
      categoryName: 'Herbal Soap',
      rawTitle:
        'Soothe Your Soul with <span style="color:#0464cb;">Herbal Goodness</span>',
      description:
        'Warm up with our nourishing herbal soups made from natural ingredients',
      image: '../../../../../assets/img/categories/soap.png',
    },
    {
      categoryName: 'Bedsheets',
      rawTitle:
        'Wrap Yourself in <span style="color:#0464cb;">Softness</span> and Serenity',
      description:
        'High-quality bedsheets designed for ultimate comfort and style',
      image: '../../../../../assets/img/categories/bedsheets.png',
    },
    {
      categoryName: 'Apparel',
      rawTitle:
        'Step into <span style="color:#0464cb;">Style</span> with Authentic Fashion',
      description:
        'From traditional to modern, dress in pieces that tell a story',
      image: '../../../../../assets/img/categories/appreal.png',
    },
    {
      categoryName: 'Winter Deals',
      rawTitle: 'Stay Warm, <span style="color:#0464cb;">Save More</span>',
      description:
        'Special winter collection and offers to keep you cozy and stylish',
      image: '../../../../../assets/img/categories/appreal.png',
    },
    {
      categoryName: 'Home Decor',
      rawTitle:
        'Turn Your Home into a <span style="color:#0464cb;">Masterpiece</span>',
      description: 'Explore handcrafted pieces to transform your living space',
      image: '../../../../../assets/img/categories/homedecor.png',
    },
    {
      categoryName: 'Handloom',
      rawTitle:
        '"Light Up Peace, <span style="color:#0464cb;">Breathe</span> In Tranquility."',
      description: '"Let the Aroma Guide You to Tranquility."',
      image: '../../../../../assets/img/categories/Handloom.png',
    },
    {
      categoryName: 'Stone',
      rawTitle:
        'Experience the <span style="color:#0464cb;">Strength</span> and Beauty of Stone',
      description:
        'Timeless stone artifacts and decor that bring natural elegance to your space',
      image: '../../../../../assets/img/categories/stone.png',
    },
    {
      categoryName: 'Stitched Suits',
      rawTitle:
        'Ready to Wear, <span style="color:#0464cb;">Made to Impress</span>',
      description: 'Stylish stitched suits for effortless fashion',
      image: '../../../../../assets/img/categories/Suits.svg',
    },
    {
      categoryName: 'Incense Sticks',
      rawTitle:
        'Awaken Your Senses with <span style="color:#0464cb;">Sacred Scents</span>',
      description: 'Purify your space with our hand-rolled incense sticks',
      image: '../../../../../assets/img/categories/incense.png',
    },
  ];

  currentCategory?: CategoryData;
  categoryName: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private _toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.route.paramMap.subscribe((params) => {
      const categoryName = params.get('categoryName');
      if (categoryName) {
        this.categoryName = categoryName; // safe now
      }
      const matched = this.categoryDetails.find(
        (cat) => cat.categoryName.toLowerCase() === categoryName?.toLowerCase()
      );

      if (matched && matched.rawTitle) {
        matched.title = this.sanitizer.bypassSecurityTrustHtml(
          matched.rawTitle
        );
        this.currentCategory = matched;
      }
    });
    this.loadCategories();
    this.loadWishlist(this.token);
    this.route.queryParams.subscribe((params) => {
      this.selectedCategory = this.categoryName;

      // Reset tag filters to default
      this.tagFilters = {
        special: false,
        popular: false,
        featured: false,
      };

      // Handle tag filters from URL (supports comma-separated values)
      const tagFromUrl = params['tags'];
      if (tagFromUrl) {
        const tagArray = tagFromUrl.split(',').map((tag: string) => tag.trim());
        (
          ['special', 'popular', 'featured'] as (keyof typeof this.tagFilters)[]
        ).forEach((tag) => {
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
    console.log(this.currentCategory);
    console.log("userCartProducts" + this.userCartProducts);
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categories:', this.categories);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }
  loadProducts(category: string): void {
    const handleProductData = (data: any) => {
      this.products = data.products || data;
      console.log('Loaded products:', this.products);

      const tagGroupsMap: { [key: string]: any[] } = {};

      this.products.forEach((product: any) => {
        const tag = product.tags?.trim(); // handle empty or missing tags
        if (tag) {
          if (!tagGroupsMap[tag]) {
            tagGroupsMap[tag] = [];
          }
          tagGroupsMap[tag].push(product);
        }
      });

      const groupedByTags = Object.entries(tagGroupsMap).map(
        ([tag, products]) => ({
          tags: tag,
          products: products,
        })
      );

      console.log('Grouped by tags:', groupedByTags);

      // Optional: store in a class property for UI use
      this.groupedProducts = groupedByTags;
    };

    if (!category || category === 'All') {
      this.productService.getAllProducts().subscribe({
        next: handleProductData,
        error: (error) => {
          console.error('Error fetching all products:', error);
        },
      });
    } else {
      this.productService.getProductsByCategory(category).subscribe({
        next: handleProductData,
        error: (error) => {
          console.error('Error fetching products:', error);
        },
      });
    }
  }

  selectCategory(categoryTitle: string): void {
    this.selectedCategory = categoryTitle;

    if (!categoryTitle || categoryTitle === 'All') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        queryParamsHandling: '',
      });
      this.loadProducts('');
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { name: categoryTitle },
        queryParamsHandling: 'merge',
      });
      this.loadProducts(categoryTitle);
    }
  }

  applyFilters(): void {
    const categoryIsAll =
      this.selectedCategory === 'All' || !this.selectedCategory;
    const anyTagSelected =
      this.tagFilters.special ||
      this.tagFilters.popular ||
      this.tagFilters.featured;

    let productFetch$;

    if (anyTagSelected) {
      productFetch$ = this.productService.getAllProducts();
    } else if (!categoryIsAll) {
      productFetch$ = this.productService.getProductsByCategory(
        this.selectedCategory
      );
    } else {
      productFetch$ = this.productService.getAllProducts();
    }

    productFetch$.subscribe({
      next: (data) => {
        let filteredProducts = data.products || data;

        // Filter by price range
        if (this.priceFrom !== null) {
          filteredProducts = filteredProducts.filter(
            (p: any) => p.price >= this.priceFrom!
          );
        }
        if (this.priceTo !== null) {
          filteredProducts = filteredProducts.filter(
            (p: any) => p.price <= this.priceTo!
          );
        }

        // Filter by tags
        if (anyTagSelected) {
          filteredProducts = filteredProducts.filter((product: any) => {
            let include = false;

            if (this.tagFilters.special && product.tags?.includes('special')) {
              include = true;
            }
            if (this.tagFilters.popular && product.tags?.includes('popular')) {
              include = true;
            }
            if (
              this.tagFilters.featured &&
              product.tags?.includes('featured')
            ) {
              include = true;
            }

            return include;
          });
        }

        // Sort products
        switch (this.selectedSortOption) {
          case 'az':
            filteredProducts.sort((a: any, b: any) =>
              a.title.localeCompare(b.title)
            );
            break;
          case 'za':
            filteredProducts.sort((a: any, b: any) =>
              b.title.localeCompare(a.title)
            );
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
      },
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
      queryParamsHandling: '',
    });

    // Fetch all products after clearing
    this.loadProducts('');
  }

  loadWishlist(token: any): void {
    this.productService.getUserWishlist(token).subscribe({
      next: (response) => {
        console.log('✅ Wishlist:', response.wishlist);
        this.wishlistProducts = response.wishlist;

        localStorage.setItem(
          'userWishlist',
          JSON.stringify(this.wishlistProducts)
        );
      },
      error: (error) => {
        console.error('❌ Error fetching wishlist:', error);
      },
    });
  }

  isWishlisted(product: any): boolean {
    return this.wishlistProducts.some((item) => item._id === product._id);
  }

  toggleWishlist(product: any): void {
    if (this.token == '') {
      alert('Please login to add to wishlist');
      this.router.navigate(['login']);
      return;
    }
    this.productService.toggleWishlist(product._id, this.token).subscribe(
      (response) => {
        const index = this.wishlistProducts.findIndex(
          (item) => item._id === product._id
        );

        if (index === -1) {
          this.wishlistProducts.push(product);
          this._toast.success({
            detail: 'SUCCESS',
            summary: 'Added to wishlist!!',
            position: 'br',
          });
        } else {
          this.wishlistProducts.splice(index, 1);
          this._toast.success({
            detail: 'SUCCESS',
            summary: 'Removed from wishlist',
            position: 'br',
          });
        }
      },
      (error) => {
        this._toast.error({
          detail: 'ERROR',
          summary: 'Wishlist toggle failed: ' + error,
          position: 'br',
        });
        console.error('Wishlist toggle failed:', error);
      }
    );
  }
}
