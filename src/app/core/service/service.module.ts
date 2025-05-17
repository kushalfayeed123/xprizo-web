import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductAbstractionService } from "./data/product/product.abstraction.service";
import { ProductImplementationService } from "./data/product/product.implementation.service";
import { ApiService } from "./data/api.service";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    {
      provide: ProductAbstractionService,
      useClass: ProductImplementationService,
    },
    {
      provide: ApiService,
      useClass: ApiService,
    },
  ],
})
export class ServiceModule {}
