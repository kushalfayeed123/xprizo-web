import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Products } from 'src/app/state/products/products.actions';
import { ProductsState } from 'src/app/state/products/products.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  featuredProducts: any[] = [];
  loading = true;

  constructor(
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    // Load products and filter for featured ones
    this.store.dispatch(new Products.LoadProducts());
    this.store.select(ProductsState.products).subscribe({
      next: (products) => {
        if (products) {
          // Get first 3 products as featured
          this.featuredProducts = products.slice(0, 3);
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        this.loading = false;
      }
    });
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  goToProductDetail(id: number) {
    this.router.navigate(['/products', id]);
  }
} 