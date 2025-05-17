// src/app/state/products/products.state.spec.ts

import { TestBed } from "@angular/core/testing";
import { NgxsModule, Store } from "@ngxs/store";
import { ProductsState } from "./products.state";

import { firstValueFrom, of } from "rxjs";
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
      isInactive: "false",
    } as Product,
    {
      id: 2,
      description: "Product 2",
      contactId: 101,
      userName: "JohnFey",
      amount: 500,
      currencyCode: "USD",
      symbol: "$",
      reference: "ABC123",
      routingCode: "RT001",
      token: "tok123",
      paymentUrl: "https://pay.com/1",
      redirectUrl: "https://redirect.com/1",
      isInactive: "false",
    } as Product,
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

  it("should load products", async () => {
    mockService.getProducts.and.returnValue(of(mockProducts));

    await firstValueFrom(store.dispatch(new Products.LoadProducts()));
    const products = await firstValueFrom(
      store.selectOnce(ProductsState.products)
    );
    expect(products.length).toBe(2);
    expect(typeof products[1].description).toBe("string");
    expect(typeof products[1].id).toBe("number");
  });

  it("should load a single product", async () => {
    const product = mockProducts[0];
    mockService.getProduct.and.returnValue(of(product));
    await firstValueFrom(store.dispatch(new Products.LoadProduct(1)));
    const selected = await firstValueFrom(
      store.selectOnce(ProductsState.selectedProduct)
    );

    expect(selected?.id).toBe(1);
    expect(typeof selected?.id).toBe("number");
  });

  it("should call addProduct on service", async () => {
    mockService.addProduct.and.returnValue(of(undefined));
    const payload = { name: "New Product" } as any;

    await store.dispatch(new Products.AddProduct(payload)).toPromise();

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
