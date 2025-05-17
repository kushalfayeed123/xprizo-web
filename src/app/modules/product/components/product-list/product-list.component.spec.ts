import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProductListComponent } from "./product-list.component";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { of } from "rxjs";
import { Product } from "src/app/core/models/product.model";
import { Products } from "src/app/state/products/products.actions";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("ProductListComponent", () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStore: jasmine.SpyObj<Store>;

  const mockProducts: Product[] = [
    {
      id: 1,
      description: "Digital Marketing Toolkit",
      contactId: 102,
      userName: "Jane Smith",
      amount: 99.0,
      currencyCode: "USD",
      symbol: "$",
      reference: "DMK2023",
      routingCode: "RT002",
      token: "xyz789",
      paymentUrl: "https://payment.example.com",
      redirectUrl: "https://app.example.com/thank-you",
      isInactive: "false",
    },
    {
      id: 2,
      description: "Alexa Toolkits",
      contactId: 102,
      userName: "John Doe",
      amount: 99.0,
      currencyCode: "USD",
      symbol: "$",
      reference: "DMK2023",
      routingCode: "RT002",
      token: "xyz789",
      paymentUrl: "https://payment.example.com",
      redirectUrl: "https://app.example.com/thank-you",
      isInactive: "false",
    },
  ];

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj("Router", ["navigate"]);
    mockStore = jasmine.createSpyObj("Store", ["select", "dispatch"]);
    mockStore.select.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore },
      ],
      schemas: [NO_ERRORS_SCHEMA], // ignore unknown elements (e.g. routerLink in template)
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should load products from the store", () => {
    expect(component.products.length).toBe(2);
    expect(component.products[0].description).toBe("Digital Marketing Toolkit");
  });

  it("should filter products by description", () => {
    component.searchTerm = "Digital Marketing Toolkit";
    const filtered = component.filteredProducts;
    expect(filtered.length).toBe(1);
    expect(filtered[0].description).toBe("Digital Marketing Toolkit");
  });

  it("should filter products by userName", () => {
    component.searchTerm = "Jane";
    const filtered = component.filteredProducts;
    expect(filtered.length).toBe(1);
    expect(filtered[0].userName).toBe("Jane Smith");
  });

  it("should navigate to product detail and dispatch LoadProduct", () => {
    const productId = 1;
    component.goToDetail(productId);

    expect(mockRouter.navigate).toHaveBeenCalledWith(["/products", productId]);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      new Products.LoadProduct(productId)
    );
  });

  it("should navigate to add product page", () => {
    component.addProduct();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/add"]);
  });
});
