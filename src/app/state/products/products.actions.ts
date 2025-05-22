// src/app/state/products/products.actions.ts

import { ProductPayload } from "src/app/core/models/product-payload.model";

export namespace Products {

  export class LoadProducts {
    static readonly type = '[Products] Load Products';
  }

  export class LoadProduct {
    static readonly type = '[Products] Load Product';
    constructor(public id: number) {}
  }

  export class SetRedirectUrl {
    static readonly type = '[Products] Set Redirect URL';
    constructor(public id: string, public url: string) {}
  }

  export class SetFilters {
    static readonly type = '[Products] Set Filters';
    constructor(public filters: {
      searchTerm?: string;
      selectedCurrency?: string;
      priceRange?: { min: number; max: number };
      sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
    }) {}
  }

  export class SetPagination {
    static readonly type = '[Products] Set Pagination';
    constructor(public pagination: {
      currentPage?: number;
      itemsPerPage?: number;
    }) {}
  }

  export class ApplyFilters {
    static readonly type = '[Products] Apply Filters';
  }

  export class AddProduct {
    static readonly type = '[Products] Add Product';
    constructor(public payload: ProductPayload) {}
  }
}
