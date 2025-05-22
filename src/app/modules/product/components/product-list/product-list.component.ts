import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { Product } from "src/app/core/models/product.model";
import { Products } from "src/app/state/products/products.actions";
import { ProductsState } from "src/app/state/products/products.state";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-productlist",
  templateUrl: "./product-list.component.html",
  styleUrl: "./product-list.component.css",
})
export class ProductListComponent implements OnInit {
  searchTerm = "";
  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 1;
  
  // Filters
  selectedCurrency: string = 'all';
  priceRange = { min: 0, max: 1000 };
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' = 'name-asc';
  
  // Available currencies for filter
  currencies = ['all', 'USD', 'EUR', 'NGN'];

  loading = true;
  error: string | null = null;
  showPaymentStatus = false;
  paymentStatus: { status: string; reference: string } | null = null;

  // Make store public for template access
  ProductsState = ProductsState;

  constructor(
    private router: Router,
    public store: Store,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('Component initialized');
    console.log('Current URL:', window.location.href);
    
    // Check URL parameters for payment status
    const params = this.route.snapshot.queryParams;
    console.log('Query params:', params);
    
    if (params['status'] && params['reference']) {
      console.log('Payment status params found:', params);
      this.paymentStatus = {
        status: params['status'],
        reference: params['reference']
      };
      this.showPaymentStatus = true;
      console.log('Modal should show:', this.showPaymentStatus);
    }

    // Reset loading state
    this.loading = true;
    this.error = null;

    // Subscribe to products state
    this.store.select(ProductsState.products).subscribe({
      next: (products) => {
        console.log('Products in state:', products);
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = error.message;
        this.loading = false;
      }
    });

    this.store.select(ProductsState.paginatedProducts).subscribe(products => {
      console.log('Paginated Products in state:', products);
    });

    this.store.select(ProductsState.filteredProducts).subscribe(filtered => {
      console.log('Filtered products:', filtered);
    });

    // Load products
    this.store.dispatch(new Products.LoadProducts()).subscribe({
      next: () => {
        console.log('Products loaded successfully');
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  onSearch(searchTerm: string) {
    this.store.dispatch(new Products.SetFilters({ searchTerm }));
  }

  onCurrencyChange(selectedCurrency: string) {
    this.store.dispatch(new Products.SetFilters({ selectedCurrency }));
  }

  onPriceRangeChange(priceRange: { min: number; max: number }) {
    this.store.dispatch(new Products.SetFilters({ priceRange }));
  }

  onSortChange(sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc') {
    this.store.dispatch(new Products.SetFilters({ sortBy }));
  }

  onPageChange(page: number) {
    this.store.dispatch(new Products.SetPagination({ currentPage: page }));
  }

  goToDetail(id: number) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  addProduct() {
    this.router.navigate(['add'], { relativeTo: this.route.parent });
  }

  closePaymentStatus() {
    console.log('Closing payment status modal');
    this.showPaymentStatus = false;
    this.paymentStatus = null;
    // Clear the URL parameters after closing the dialog
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true
    });
  }
}
