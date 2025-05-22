import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { Product } from "src/app/core/models/product.model";
import { ProductsState } from "src/app/state/products/products.state";
import { Products } from "src/app/state/products/products.actions";
import { NavigationService } from "src/app/core/service/navigation.service";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrl: "./product-detail.component.css",
})
export class ProductDetailComponent implements OnInit {
  product: Product = <Product>{};
  processingPayment = false;
  loading = true;
  error: string | null = null;
  showPaymentStatus = false;
  paymentStatus: { status: string; reference: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    console.log("Component initialized");
    console.log("Current URL:", window.location.href);

    // First check URL parameters for payment status
    const params = this.route.snapshot.queryParams;
    console.log("Query params:", params);

    if (params["status"] && params["reference"]) {
      console.log("Payment status params found:", params);
      this.paymentStatus = {
        status: params["status"],
        reference: params["reference"],
      };
      this.showPaymentStatus = true;
      console.log("Modal should show:", this.showPaymentStatus);
      console.log("Payment status:", this.paymentStatus);
    }

    // Then load the product
    const id = parseInt(this.route.snapshot.params["id"], 10);
    if (isNaN(id)) {
      this.error = "Invalid product ID";
      this.loading = false;
      return;
    }
    this.setupPaymentAndLoadProduct(id);
  }

  closePaymentStatus() {
    console.log("Closing payment status modal");
    this.showPaymentStatus = false;
    this.paymentStatus = null;
    // Clear the URL parameters after closing the dialog
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true,
    });
  }

  private setupPaymentAndLoadProduct(id: number) {
    this.loading = true;
    this.error = null;

    // First set the redirect URL
    const redirectUrl = `${window.location.origin}/products`;
    this.store
      .dispatch(new Products.SetRedirectUrl(id.toString(), redirectUrl))
      .subscribe({
        next: () => {
          // After successful redirect URL setup, load the product
          this.store.dispatch(new Products.LoadProduct(id));

          this.store.select(ProductsState.selectedProduct).subscribe({
            next: (res) => {
              if (res) {
                this.product = res;
                this.loading = false;
              }
            },
            error: (error) => {
              this.error = "Failed to load product details";
              this.loading = false;
              console.error("Error loading product:", error);
            },
          });
        },
        error: (error) => {
          this.error = "Failed to set up payment";
          this.loading = false;
          console.error("Error setting redirect URL:", error);
        },
      });
  }

  initiatePayment() {
    if (this.product.paymentUrl) {
      this.processingPayment = true;
      this.navigationService.navigateToUrl(this.product.paymentUrl);
    }
  }

  goBack() {
    this.router.navigate(["/products"]);
  }
}
