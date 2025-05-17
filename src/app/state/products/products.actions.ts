// src/app/state/products/products.actions.ts

import { ProductPayload } from "src/app/core/models/product-payload.model";

export class LoadProducts {
  static readonly type = "[Products] Load Products";
}

export class LoadProduct {
  static readonly type = "[Products] Load Product";
  constructor(public id: number) {}
}

export class AddProduct {
  static readonly type = "[Products] Add Product";
  constructor(public payload: ProductPayload) {}
}

export class SetRedirectUrl {
  static readonly type = "[Products] Set Redirect URL";
  constructor(public id: string, public url: string) {}
}
