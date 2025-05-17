// src/app/state/products/products.state.spec.ts

import { TestBed } from "@angular/core/testing";
import { NgxsModule, Store } from "@ngxs/store";
import { ProductsState } from "./products.state";
import {
  LoadProducts,
  LoadProduct,
  AddProduct,
  SetRedirectUrl,
} from "./products.actions";
import { firstValueFrom, of } from "rxjs";
import { Product } from "src/app/core/models/product.model";
import { ProductAbstractionService } from "src/app/core/service/data/product/product.abstraction.service";

describe("ProductsState", () => {
  let store: Store;
  let mockService: jasmine.SpyObj<ProductAbstractionService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      description: "Product A",
      contactId: 1,
      userName: "string",
      amount: 10,
      currencyCode: "",
      symbol: "",
      reference: "",
      routingCode: "",
      token: "",
      paymentUrl: "",
      redirectUrl: "",
      isInactive: "",
    } as Product,
    {
      id: 2,
      description: "Product B",
      contactId: 1,
      userName: "string",
      amount: 10,
      currencyCode: "",
      symbol: "",
      reference: "",
      routingCode: "",
      token: "",
      paymentUrl: "",
      redirectUrl: "",
      isInactive: "",
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

    await firstValueFrom(store.dispatch(new LoadProducts()));
    const products = await firstValueFrom(
      store.selectOnce(ProductsState.products)
    );
    expect(products.length).toBe(2);
    expect(products[0].description).toBe("Product A");
  });

  it("should load a single product", async () => {
    const product = mockProducts[0];
    mockService.getProduct.and.returnValue(of(product));
    await firstValueFrom(store.dispatch(new LoadProduct(1)));
    const selected = await firstValueFrom(
      store.selectOnce(ProductsState.selectedProduct)
    );

    expect(selected?.id).toBe(1);
  });

  it("should call addProduct on service", async () => {
    mockService.addProduct.and.returnValue(of(undefined));
    const payload = { name: "New Product" } as any;

    await store.dispatch(new AddProduct(payload)).toPromise();

    expect(mockService.addProduct).toHaveBeenCalledWith(payload);
  });

  it("should call setRedirectUrl on service", async () => {
    mockService.setRedirectUrl.and.returnValue(of(undefined));

    await store
      .dispatch(new SetRedirectUrl("123", "http://example.com"))
      .toPromise();

    expect(mockService.setRedirectUrl).toHaveBeenCalledWith(
      "123",
      "http://example.com"
    );
  });
});
