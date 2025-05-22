import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { Products } from "src/app/state/products/products.actions";
import { ProductPayload } from "src/app/core/models/product-payload.model";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrl: "./add-product.component.css",
})
export class AddProductComponent {
  product: ProductPayload = {
    description: "",
    amount: 0,
    currencyCode: "EUR",
    reference: this.generateUniqueId(),
  };

  success = false;

  constructor(private router: Router, private store: Store) {}

  addProduct() {
    if (this.isFormValid()) {
      this.product.reference = this.generateUniqueId();

      this.store.dispatch(new Products.AddProduct(this.product)).subscribe({
        next: () => {
          // Reload products after successful addition
          this.store.dispatch(new Products.LoadProducts()).subscribe({
            next: () => {
              this.success = true;
            },
          });
        },
        error: (error) => {
          console.error("Error adding product:", error);
          // Handle error appropriately
        },
      });
    }
  }

  private isFormValid(): boolean {
    return this.product.description.trim() !== "" && this.product.amount > 0;
  }

  private generateUniqueId(): string {
    const id = uuidv4();

    return id;
  }

  goBack() {
    this.router.navigate(["/products"]);
  }
}
