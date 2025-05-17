import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrl: "./add-product.component.css",
})
export class AddProductComponent {
  product = {
    description: "",
    amount: 0,
    currencyCode: "USD",
    symbol: "$",
    userName: "",
  };

  success = false;

  constructor(private router: Router) {}

  addProduct() {
    // Simulate adding product
    this.success = true;
  }

  goBack() {
    this.router.navigate(["/products"]);
  }
}
