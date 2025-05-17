// src/app/state/products/products.state.ts

import { State, Action, StateContext, Selector } from "@ngxs/store";
import { Injectable } from "@angular/core";

import { tap } from "rxjs/operators";
import { ProductAbstractionService } from "src/app/core/service/data/product/product.abstraction.service";
import { Product } from "src/app/core/models/product.model";
import { Products } from "./products.actions";

export interface ProductsStateModel {
  products: Product[];
  selectedProduct: Product | null;
}

@State<ProductsStateModel>({
  name: "products",
  defaults: {
    products: [],
    selectedProduct: null,
  },
})
@Injectable()
export class ProductsState {
  constructor(private productService: ProductAbstractionService) {}

  @Selector()
  static products(state: ProductsStateModel) {
    return state.products;
  }

  @Selector()
  static selectedProduct(state: ProductsStateModel) {
    return state.selectedProduct;
  }

  @Action(Products.LoadProducts)
  loadProducts(ctx: StateContext<ProductsStateModel>) {
    return this.productService.getProducts().pipe(
      tap((products) => {
        ctx.patchState({ products });
      })
    );
  }

  @Action(Products.LoadProduct)
  loadProduct(
    ctx: StateContext<ProductsStateModel>,
    action: Products.LoadProduct
  ) {
    return this.productService.getProduct(action.id).pipe(
      tap((product) => {
        ctx.patchState({ selectedProduct: product });
      })
    );
  }

  @Action(Products.AddProduct)
  addProduct(
    ctx: StateContext<ProductsStateModel>,
    action: Products.AddProduct
  ) {
    return this.productService.addProduct(action.payload);
  }

  @Action(Products.SetRedirectUrl)
  setRedirectUrl(
    _: StateContext<ProductsStateModel>,
    action: Products.SetRedirectUrl
  ) {
    return this.productService.setRedirectUrl(action.id, action.url);
  }
}
