// src/app/state/products/products.state.ts

import { State, Action, StateContext, Selector } from "@ngxs/store";
import { Injectable } from "@angular/core";

import { tap } from "rxjs/operators";
import { ProductAbstractionService } from "src/app/core/service/data/product/product.abstraction.service";
import { Product } from "src/app/core/models/product.model";
import { Products } from "./products.actions";

export interface ProductsStateModel {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  filters: {
    searchTerm: string;
    selectedCurrency: string;
    priceRange: { min: number; max: number };
    sortBy: "price-asc" | "price-desc" | "name-asc" | "name-desc";
  };
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
  };
}

@State<ProductsStateModel>({
  name: "products",
  defaults: {
    products: [],
    filteredProducts: [],
    selectedProduct: null,
    loading: false,
    error: null,
    filters: {
      searchTerm: "",
      selectedCurrency: "all",
      priceRange: { min: 0, max: 1000 },
      sortBy: "name-asc"
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 9,
      totalPages: 1
    }
  }
})
@Injectable()
export class ProductsState {
  constructor(private productsService: ProductAbstractionService) {}

  @Selector()
  static products(state: ProductsStateModel): Product[] {
    return state.products;
  }

  @Selector()
  static filteredProducts(state: ProductsStateModel): Product[] {
    return state.filteredProducts;
  }

  @Selector()
  static paginatedProducts(state: ProductsStateModel): Product[] {
    if (!state.filteredProducts) return [];
    const itemsPerPage = state.pagination?.itemsPerPage || 9;
    const currentPage = state.pagination?.currentPage || 1;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    console.log('Paginated products:', {
      start,
      end,
      itemsPerPage,
      currentPage,
      total: state.filteredProducts.length,
      filtered: state.filteredProducts
    });
    return state.filteredProducts.slice(start, end);
  }

  @Selector()
  static selectedProduct(state: ProductsStateModel): Product | null {
    return state.selectedProduct;
  }

  @Selector()
  static loading(state: ProductsStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: ProductsStateModel): string | null {
    return state.error;
  }

  @Selector()
  static filters(state: ProductsStateModel) {
    return state.filters;
  }

  @Selector()
  static pagination(state: ProductsStateModel) {
    return state.pagination;
  }

  @Action(Products.LoadProducts)
  loadProducts(ctx: StateContext<ProductsStateModel>) {
    const state = ctx.getState();
    ctx.patchState({ loading: true, error: null });

    return this.productsService.getProducts().pipe(
      tap({
        next: (products) => {
          ctx.patchState({ 
            products,
            filteredProducts: products,
            loading: false,
            error: null,
            pagination: {
              ...state.pagination,
              totalPages: Math.ceil(products.length / (state.pagination?.itemsPerPage || 9))
            }
          });
          // Apply initial filters
          ctx.dispatch(new Products.ApplyFilters());
        },
        error: (error) => {
          console.error('Error loading products:', error);
          ctx.patchState({ 
            error: 'Failed to load products',
            loading: false,
            products: [],
            filteredProducts: []
          });
        }
      })
    );
  }

  @Action(Products.LoadProduct)
  loadProduct(
    ctx: StateContext<ProductsStateModel>,
    action: Products.LoadProduct
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true, error: null });

    return this.productsService.getProduct(action.id).pipe(
      tap({
        next: (product) => {
          ctx.patchState({
            selectedProduct: product,
            loading: false,
            error: null
          });
        },
        error: (error) => {
          console.error("Error loading product:", error);
          ctx.patchState({
            error: "Failed to load product",
            loading: false,
            selectedProduct: null
          });
        },
      })
    );
  }

  @Action(Products.AddProduct)
  addProduct(
    ctx: StateContext<ProductsStateModel>,
    action: Products.AddProduct
  ) {
    return this.productsService.addProduct(action.payload);
  }

  @Action(Products.SetRedirectUrl)
  setRedirectUrl(
    _: StateContext<ProductsStateModel>,
    action: Products.SetRedirectUrl
  ) {
    return this.productsService.setRedirectUrl(action.id, action.url);
  }

  @Action(Products.SetFilters)
  setFilters(
    ctx: StateContext<ProductsStateModel>,
    action: Products.SetFilters
  ) {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        ...action.filters,
      },
    });
    return ctx.dispatch(new Products.ApplyFilters());
  }

  @Action(Products.SetPagination)
  setPagination(
    ctx: StateContext<ProductsStateModel>,
    action: Products.SetPagination
  ) {
    const state = ctx.getState();
    ctx.patchState({
      pagination: {
        ...state.pagination,
        ...action.pagination,
      },
    });
  }

  @Action(Products.ApplyFilters)
  applyFilters(ctx: StateContext<ProductsStateModel>) {
    const state = ctx.getState();
    let filtered = [...state.products];

    // Apply search filter
    if (state.filters.searchTerm) {
      const searchLower = state.filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.description.toLowerCase().includes(searchLower) ||
          product.userName.toLowerCase().includes(searchLower)
      );
    }

    // Apply currency filter
    if (state.filters.selectedCurrency && state.filters.selectedCurrency !== 'all') {
      filtered = filtered.filter(
        product => product.currencyCode === state.filters.selectedCurrency
      );
    }

    // Apply price range filter
    if (state.filters.priceRange?.min !== undefined && state.filters.priceRange?.max !== undefined) {
      filtered = filtered.filter(
        product =>
          product.amount >= state.filters.priceRange!.min &&
          product.amount <= state.filters.priceRange!.max
      );
    }

    // Apply sorting
    switch (state.filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'name-asc':
        filtered.sort((a, b) =>
          a.description.localeCompare(b.description)
        );
        break;
      case 'name-desc':
        filtered.sort((a, b) =>
          b.description.localeCompare(a.description)
        );
        break;
    }

    const itemsPerPage = state.pagination?.itemsPerPage || 9;
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    ctx.patchState({
      filteredProducts: filtered,
      pagination: {
        ...state.pagination,
        totalPages,
        currentPage: Math.min(state.pagination?.currentPage || 1, totalPages || 1)
      }
    });
  }
}
