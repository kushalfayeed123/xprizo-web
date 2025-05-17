import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProductRoutingModule } from "./product-routing.module";
import { ProductLayoutComponent } from "./components/product-layout/product-layout.component";
import { FormsModule } from "@angular/forms";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { ProductDetailComponent } from "./components/product-detail/product-detail.component";
import { AddProductComponent } from "./components/add-product/add-product.component";

@NgModule({
  declarations: [
    ProductLayoutComponent,
    ProductListComponent,
    ProductDetailComponent,
    AddProductComponent,
  ],
  imports: [CommonModule, ProductRoutingModule, FormsModule],
})
export class ProductModule {}
