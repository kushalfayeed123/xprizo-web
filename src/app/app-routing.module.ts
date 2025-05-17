import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductLayoutComponent } from "./modules/product/components/product-layout/product-layout.component";

const routes: Routes = [

  {
    path: "",
    component: ProductLayoutComponent,
    loadChildren: () =>
      import("./modules/product/product.module").then((m) => m.ProductModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
