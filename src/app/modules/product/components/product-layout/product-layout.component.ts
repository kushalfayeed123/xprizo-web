import { Component } from "@angular/core";
import { Store } from "@ngxs/store";
import { Products } from "src/app/state/products/products.actions";

@Component({
  selector: "app-product-layout",
  templateUrl: "./product-layout.component.html",
  styleUrl: "./product-layout.component.css",
})
export class ProductLayoutComponent {
  constructor(private store: Store) {
    this.store.dispatch(new Products.LoadProducts());
  }

  currentYear = new Date().getFullYear();
}
