import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProductDetailComponent } from "./product-detail.component";
import { NgxsModule, Store } from "@ngxs/store";
import { ProductsState } from "src/app/state/products/products.state";
import { RouterTestingModule } from "@angular/router/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { Product } from "src/app/core/models/product.model";
import { NavigationService } from "src/app/core/service/navigation.service";

describe("ProductDetailComponent", () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let store: Store;
  let router: Router;
  let navigationService: NavigationService;

  const mockProduct: Product = {
    id: 123,
    description: "Test product",
    amount: 100,
    currencyCode: "USD",
    symbol: "$",
    userName: "TestUser",
    contactId: 0,
    reference: "",
    routingCode: "",
    token: "",
    paymentUrl: "",
    redirectUrl: "",
    isInactive: false,
    imageUrl: "./assets/images/product-1.jpg",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ProductsState]), RouterTestingModule],
      declarations: [ProductDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
            queryParams: of({}),
            snapshot: {
              params: { id: 1 },
              queryParams: {},
            },
          },
        },
        NavigationService,
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    navigationService = TestBed.inject(NavigationService);
    spyOn(store, "select").and.returnValue(of(mockProduct));
    spyOn(store, "dispatch").and.returnValue(of(undefined));
    spyOn(router, "navigate");
    spyOn(navigationService, "navigateToUrl");

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should subscribe to selectedProduct and update product", () => {
    expect(store.select).toHaveBeenCalledWith(ProductsState.selectedProduct);
    expect(component.product).toEqual(mockProduct);
  });

  it("should handle payment status from query params", () => {
    const mockRoute = TestBed.inject(ActivatedRoute);
    (mockRoute.snapshot as any).queryParams = {
      status: "success",
      reference: "REF123",
    };

    component.ngOnInit();
    expect(component.paymentStatus).toEqual({
      status: "success",
      reference: "REF123",
    });
    expect(component.showPaymentStatus).toBeTrue();
  });

  it("should close payment status and clear URL params", () => {
    component.showPaymentStatus = true;
    component.paymentStatus = { status: "success", reference: "REF123" };

    component.closePaymentStatus();

    expect(component.showPaymentStatus).toBeFalse();
    expect(component.paymentStatus).toBeNull();
  });

  it("should handle invalid product ID", () => {
    const mockRoute = TestBed.inject(ActivatedRoute);
    (mockRoute.snapshot as any).params = { id: "invalid" };

    component.ngOnInit();

    expect(component.error).toBe("Invalid product ID");
    expect(component.loading).toBeFalse();
  });

  it("should handle error loading product details", () => {
    const error = new Error("Failed to load product");
    (store.select as jasmine.Spy).and.returnValue(throwError(() => error));
    spyOn(console, "error");

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith("Error loading product:", error);
    expect(component.error).toBe("Failed to load product details");
    expect(component.loading).toBeFalse();
  });

  it("should handle error setting up payment", () => {
    const error = new Error("Payment setup failed");
    (store.dispatch as jasmine.Spy).and.returnValue(throwError(() => error));
    spyOn(console, "error");

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith(
      "Error setting redirect URL:",
      error
    );
    expect(component.error).toBe("Failed to set up payment");
    expect(component.loading).toBeFalse();
  });

  it("should initiate payment when payment URL is available", () => {
    const productWithPaymentUrl = {
      ...mockProduct,
      paymentUrl: "https://payment.example.com",
    };
    component.product = productWithPaymentUrl;

    component.initiatePayment();

    expect(component.processingPayment).toBeTrue();
    expect(navigationService.navigateToUrl).toHaveBeenCalledWith(
      productWithPaymentUrl.paymentUrl
    );
  });

  it("should not initiate payment when payment URL is not available", () => {
    component.product = mockProduct;

    component.initiatePayment();

    expect(component.processingPayment).toBeFalse();
    expect(navigationService.navigateToUrl).not.toHaveBeenCalled();
  });

  it("should navigate back to products list", () => {
    component.goBack();

    expect(router.navigate).toHaveBeenCalledWith(["/products"]);
  });
});
