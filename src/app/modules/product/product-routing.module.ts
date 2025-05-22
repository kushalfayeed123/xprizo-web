import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { ProductDetailComponent } from "./components/product-detail/product-detail.component";
import { AddProductComponent } from "./components/add-product/add-product.component";
import { ProductLayoutComponent } from "./components/product-layout/product-layout.component";

const routes: Routes = [
  {
    path: "",
    component: ProductLayoutComponent,
    children: [
      { path: "", component: ProductListComponent },
      { path: "add", component: AddProductComponent },
      { path: ":id", component: ProductDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
