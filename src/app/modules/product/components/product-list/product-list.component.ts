import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { Product } from "src/app/core/models/product.model";
import { Products } from "src/app/state/products/products.actions";
import { ProductsState } from "src/app/state/products/products.state";

@Component({
  selector: "app-productlist",

  templateUrl: "./product-list.component.html",
  styleUrl: "./product-list.component.css",
})
export class ProductListComponent {
  searchTerm = "";

  products: Product[] = [];

  get filteredProducts() {
    return this.products.filter(
      (p) =>
        p.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.userName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  constructor(private router: Router, private store: Store) {
    this.store.select(ProductsState.products).subscribe({
      next: (res) => {
        this.products = res;
      },
    });
  }

  goToDetail(id: number) {
    this.router.navigate(["/products", id]);
    this.store.dispatch(new Products.LoadProduct(id));
  }

  addProduct() {
    this.router.navigate(["/add"]);
  }
}
