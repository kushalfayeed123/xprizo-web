// src/app/state/products/products.state.spec.ts

import { TestBed } from "@angular/core/testing";
import { NgxsModule, Store } from "@ngxs/store";
import { ProductsState } from "./products.state";
import { firstValueFrom, of, throwError } from "rxjs";
import { Product } from "src/app/core/models/product.model";
import { ProductAbstractionService } from "src/app/core/service/data/product/product.abstraction.service";
import { Products } from "./products.actions";

describe("ProductsState", () => {
  let store: Store;
  let mockService: jasmine.SpyObj<ProductAbstractionService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      description: "Product 1",
      contactId: 101,
      userName: "JohnDoe",
      amount: 500,
      currencyCode: "USD",
      symbol: "$",
      reference: "ABC123",
      routingCode: "RT001",
      token: "tok123",
      paymentUrl: "https://pay.com/1",
      redirectUrl: "https://redirect.com/1",
      isInactive: false,
      imageUrl: "./assets/images/product-1.jpg"
    } as Product,
    {
      id: 2,
      description: "Product 2",
      contactId: 101,
      userName: "JohnFey",
      amount: 300,
      currencyCode: "EUR",
      symbol: "€",
      reference: "ABC124",
      routingCode: "RT002",
      token: "tok124",
      paymentUrl: "https://pay.com/2",
      redirectUrl: "https://redirect.com/2",
      isInactive: false,
      imageUrl: "./assets/images/product-2.jpg"
    } as Product,
    {
      id: 3,
      description: "Product 3",
      contactId: 102,
      userName: "JaneSmith",
      amount: 700,
      currencyCode: "USD",
      symbol: "$",
      reference: "ABC125",
      routingCode: "RT003",
      token: "tok125",
      paymentUrl: "https://pay.com/3",
      redirectUrl: "https://redirect.com/3",
      isInactive: true,
      imageUrl: "./assets/images/product-3.jpg"
    } as Product
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj<ProductAbstractionService>(
      "ProductAbstractionService",
      ["getProducts", "getProduct", "addProduct", "setRedirectUrl"]
    );

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ProductsState])],
      providers: [{ provide: ProductAbstractionService, useValue: spy }],
    });

    store = TestBed.inject(Store);
    mockService = TestBed.inject(ProductAbstractionService) as jasmine.SpyObj<
      ProductAbstractionService
    >;
  });

  it("should load products with correct structure", async () => {
    mockService.getProducts.and.returnValue(of(mockProducts));

    await firstValueFrom(store.dispatch(new Products.LoadProducts()));
    const products = await firstValueFrom(
      store.selectOnce(ProductsState.products)
    );
    
    expect(products.length).toBe(3);
    
    // Test structure of first product
    const product = products[0];
    expect(typeof product.id).toBe("number");
    expect(typeof product.description).toBe("string");
    expect(product.description).toBeTruthy();
    expect(typeof product.contactId).toBe("number");
    expect(typeof product.userName).toBe("string");
    expect(product.userName).toBeTruthy();
    expect(typeof product.amount).toBe("number");
    expect(typeof product.currencyCode).toBe("string");
    expect(typeof product.symbol).toBe("string");
    expect(typeof product.reference).toBe("string");
    expect(typeof product.routingCode).toBe("string");
    expect(typeof product.token).toBe("string");
    expect(typeof product.paymentUrl).toBe("string");
    expect(typeof product.redirectUrl).toBe("string");
    expect(typeof product.isInactive).toBe("boolean");
    expect(typeof product.imageUrl).toBe("string");
    expect(product.imageUrl).toMatch(/^\.\/assets\/images\/.*\.jpg$/); // this may be useless
  });

  it("should handle error when loading products", async () => {
    mockService.getProducts.and.returnValue(throwError(() => new Error("Failed to load")));

    try {
      await firstValueFrom(store.dispatch(new Products.LoadProducts()));
    } catch (error) {
      // Expected error
    }

    const error = await firstValueFrom(store.selectOnce(ProductsState.error));
    const loading = await firstValueFrom(store.selectOnce(ProductsState.loading));
    const products = await firstValueFrom(store.selectOnce(ProductsState.products));

    expect(error).toBe("Failed to load products");
    expect(loading).toBeFalse();
    expect(products).toEqual([]);
  });

  it("should load a single product", async () => {
    const product = mockProducts[0];
    mockService.getProduct.and.returnValue(of(product));
    await firstValueFrom(store.dispatch(new Products.LoadProduct(1)));
    const selected = await firstValueFrom(
      store.selectOnce(ProductsState.selectedProduct)
    );

    expect(selected?.id).toBe(1);
    expect(selected?.description).toBe("Product 1");
    expect(selected?.imageUrl).toBe("./assets/images/product-1.jpg");
  });

  it("should handle error when loading single product", async () => {
    mockService.getProduct.and.returnValue(throwError(() => new Error("Failed to load")));

    try {
      await firstValueFrom(store.dispatch(new Products.LoadProduct(1)));
    } catch (error) {
      // Expected error
    }

    const error = await firstValueFrom(store.selectOnce(ProductsState.error));
    const loading = await firstValueFrom(store.selectOnce(ProductsState.loading));
    const selectedProduct = await firstValueFrom(store.selectOnce(ProductsState.selectedProduct));

    expect(error).toBe("Failed to load product");
    expect(loading).toBeFalse();
    expect(selectedProduct).toBeNull();
  });

  it("should filter products by search term with correct structure", async () => {
    mockService.getProducts.and.returnValue(of(mockProducts));
    await firstValueFrom(store.dispatch(new Products.LoadProducts()));
    
    await firstValueFrom(store.dispatch(new Products.SetFilters({ searchTerm: "Product 1" })));
    const filtered = await firstValueFrom(store.selectOnce(ProductsState.filteredProducts));
    
    expect(filtered.length).toBe(1);
    expect(typeof filtered[0].description).toBe("string");
    expect(filtered[0].description).toContain("Product 1");
  });

  it("should filter products by currency with correct structure", async () => {
    mockService.getProducts.and.returnValue(of(mockProducts));
    await firstValueFrom(store.dispatch(new Products.LoadProducts()));
    
    await firstValueFrom(store.dispatch(new Products.SetFilters({ selectedCurrency: "EUR" })));
    const filtered = await firstValueFrom(store.selectOnce(ProductsState.filteredProducts));
    
    expect(filtered.length).toBe(1);
    expect(typeof filtered[0].currencyCode).toBe("string");
    expect(filtered[0].currencyCode).toBe("EUR");
  });

  it("should filter products by price range with correct structure", async () => {
    mockService.getProducts.and.returnValue(of(mockProducts));
    await firstValueFrom(store.dispatch(new Products.LoadProducts()));
    
    await firstValueFrom(store.dispatch(new Products.SetFilters({ 
      priceRange: { min: 400, max: 600 } 
    })));
    const filtered = await firstValueFrom(store.selectOnce(ProductsState.filteredProducts));
    
    expect(filtered.length).toBe(1);
    expect(typeof filtered[0].amount).toBe("number");
    expect(filtered[0].amount).toBeGreaterThanOrEqual(400);
    expect(filtered[0].amount).toBeLessThanOrEqual(600);
  });

  it("should sort products by price ascending", async () => {
    mockService.getProducts.and.returnValue(of(mockProducts));
    await firstValueFrom(store.dispatch(new Products.LoadProducts()));
    
    await firstValueFrom(store.dispatch(new Products.SetFilters({ sortBy: "price-asc" })));
    const filtered = await firstValueFrom(store.selectOnce(ProductsState.filteredProducts));
    
    expect(filtered[0].amount).toBe(300);
    expect(filtered[1].amount).toBe(500);
    expect(filtered[2].amount).toBe(700);
  });

  it("should sort products by price descending", async () => {
    mockService.getProducts.and.returnValue(of(mockProducts));
    await firstValueFrom(store.dispatch(new Products.LoadProducts()));
    
    await firstValueFrom(store.dispatch(new Products.SetFilters({ sortBy: "price-desc" })));
    const filtered = await firstValueFrom(store.selectOnce(ProductsState.filteredProducts));
    
    expect(filtered[0].amount).toBe(700);
    expect(filtered[1].amount).toBe(500);
    expect(filtered[2].amount).toBe(300);
  });

  it("should paginate products correctly", async () => {
    mockService.getProducts.and.returnValue(of(mockProducts));
    await firstValueFrom(store.dispatch(new Products.LoadProducts()));
    
    // Set items per page to 2
    await firstValueFrom(store.dispatch(new Products.SetPagination({ itemsPerPage: 2 })));
    
    // First page
    const page1 = await firstValueFrom(store.selectOnce(ProductsState.paginatedProducts));
    expect(page1.length).toBe(2);
    
    // Second page
    await firstValueFrom(store.dispatch(new Products.SetPagination({ currentPage: 2 })));
    const page2 = await firstValueFrom(store.selectOnce(ProductsState.paginatedProducts));
    expect(page2.length).toBe(1);
  });

  it("should call addProduct on service", async () => {
    mockService.addProduct.and.returnValue(of(undefined));
    const payload = { name: "New Product" } as any;

    await firstValueFrom(store.dispatch(new Products.AddProduct(payload)));
    expect(mockService.addProduct).toHaveBeenCalledWith(payload);
  });

  it("should call setRedirectUrl on service", async () => {
    mockService.setRedirectUrl.and.returnValue(of(undefined));
    await firstValueFrom(
      store.dispatch(new Products.SetRedirectUrl("123", "http://example.com"))
    );

    expect(mockService.setRedirectUrl).toHaveBeenCalledWith(
      "123",
      "http://example.com"
    );
  });
});
