import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { ProductDetailComponent } from "./components/product-detail/product-detail.component";
import { AddProductComponent } from "./components/add-product/add-product.component";

const routes: Routes = [
  {
    path: "products",
    component: ProductListComponent,
  },
  { path: "products/:id", component: ProductDetailComponent },
  { path: "add", component: AddProductComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
