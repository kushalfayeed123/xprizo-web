import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngxs/store";
import { Product } from "src/app/core/models/product.model";
import { ProductsState } from "src/app/state/products/products.state";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrl: "./product-detail.component.css",
})
export class ProductDetailComponent {
  product!: Product;

  constructor(private route: ActivatedRoute, private store: Store) {

    this.store.select(ProductsState.selectedProduct).subscribe({
      next: (res) => {
        this.product = res!;
      },
    });
  }
}
