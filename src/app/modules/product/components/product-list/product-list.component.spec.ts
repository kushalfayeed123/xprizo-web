import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ProductListComponent } from "./product-list.component";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { of, throwError, firstValueFrom, BehaviorSubject, Subject, Observable } from "rxjs";
import { Product } from "src/app/core/models/product.model";
import { Products } from "src/app/state/products/products.actions";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { ProductsState } from "src/app/state/products/products.state";
import { RouterTestingModule } from "@angular/router/testing";
import { ActivatedRoute } from "@angular/router";
import { take, catchError, finalize } from "rxjs/operators";
import { TypedSelector } from "@ngxs/store";

describe("ProductListComponent", () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStore: jasmine.SpyObj<Store>;
  let store: Store;
  let consoleSpy: jasmine.Spy;

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
      isInactive: false,
      imageUrl: "./assets/images/product-1.jpg"
    },
    {
      id: 2,
      description: "Alexa Toolkits",
      contactId: 102,
      userName: "John Doe",
      amount: 99.0,
      currencyCode: "EUR",
      symbol: "€",
      reference: "DMK2023",
      routingCode: "RT002",
      token: "xyz789",
      paymentUrl: "https://payment.example.com",
      redirectUrl: "https://app.example.com/thank-you",
      isInactive: false,
      imageUrl: "./assets/images/product-2.jpg"
    },
  ];

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj("Router", ["navigate"]);
    mockStore = jasmine.createSpyObj("Store", ["select", "dispatch"]);
    consoleSpy = spyOn(console, 'log');
    
    // Mock store select to return different values based on selector
    mockStore.select.and.callFake(<T>(selector: TypedSelector<T>) => {
      if (selector === ProductsState.products) {
        return of(mockProducts) as unknown as Observable<T>;
      }
      if (selector === ProductsState.filteredProducts) {
        return of(mockProducts) as unknown as Observable<T>;
      }
      if (selector === ProductsState.paginatedProducts) {
        return of(mockProducts) as unknown as Observable<T>;
      }
      return of([]) as unknown as Observable<T>;
    });
    
    // Mock store dispatch to handle different actions
    mockStore.dispatch.and.callFake((action) => {
      if (action instanceof Products.LoadProducts) {
        return of(undefined);
      }
      if (action instanceof Products.LoadProduct) {
        return of(undefined);
      }
      return of(undefined);
    });

    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ProductsState]),
        RouterTestingModule
      ],
      declarations: [ProductListComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {}
            },
            queryParams: of({})
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with default values", () => {
    expect(component.searchTerm).toBe("");
    expect(component.products).toEqual([]);
    expect(component.currentPage).toBe(1);
    expect(component.itemsPerPage).toBe(9);
    expect(component.selectedCurrency).toBe('all');
    expect(component.priceRange).toEqual({ min: 0, max: 1000 });
    expect(component.sortBy).toBe('name-asc');
    expect(component.currencies).toEqual(['all', 'USD', 'EUR', 'NGN']);
    expect(component.loading).toBe(true);
    expect(component.error).toBeNull();
    expect(component.showPaymentStatus).toBeFalse();
    expect(component.paymentStatus).toBeNull();
  });

  it("should load products from the store", () => {
    component.ngOnInit();
    expect(component.products).toEqual(mockProducts);
    expect(component.loading).toBeFalse();
  });



  it("should handle LoadProducts dispatch error", () => {
    const error = new Error('Load error');
    const consoleErrorSpy = spyOn(console, 'error');

    mockStore.dispatch.and.returnValue(throwError(() => error));

    component.ngOnInit();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading products:', error);
    expect(component.error).toBe(error.message);
    expect(component.loading).toBeFalse();
  });

  it("should filter products by description", () => {
    component.searchTerm = "Digital Marketing Toolkit";
    component.onSearch(component.searchTerm);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      new Products.SetFilters({ searchTerm: "Digital Marketing Toolkit" })
    );
  });

  it("should filter products by userName", () => {
    component.searchTerm = "Jane";
    component.onSearch(component.searchTerm);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      new Products.SetFilters({ searchTerm: "Jane" })
    );
  });

  it("should handle all currency changes", () => {
    component.currencies.forEach(currency => {
      component.onCurrencyChange(currency);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new Products.SetFilters({ selectedCurrency: currency })
      );
    });
  });

  it("should handle price range change", () => {
    const priceRange = { min: 50, max: 200 };
    component.onPriceRangeChange(priceRange);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      new Products.SetFilters({ priceRange })
    );
  });

  it("should handle all sort options", () => {
    const sortOptions: Array<'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'> = [
      'price-asc',
      'price-desc',
      'name-asc',
      'name-desc'
    ];

    sortOptions.forEach(sortBy => {
      component.onSortChange(sortBy);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new Products.SetFilters({ sortBy })
      );
    });
  });

  it("should handle page change", () => {
    component.onPageChange(2);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      new Products.SetPagination({ currentPage: 2 })
    );
  });

  it("should handle loading state", async () => {
    const productsSubject = new Subject<Product[]>();
    
    mockStore.select.and.returnValue(productsSubject);
    mockStore.dispatch.and.returnValue(of(undefined));
    
    component.ngOnInit();
    expect(component.loading).toBeTrue();
    
    productsSubject.next(mockProducts);
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(component.loading).toBeFalse();
    expect(component.products).toEqual(mockProducts);
  });

  it("should navigate to product detail", () => {
    const productId = 1;
    component.goToDetail(productId);
    expect(mockRouter.navigate).toHaveBeenCalledWith([productId], { relativeTo: component.route });
  });

  it("should navigate to add product page", () => {
    component.addProduct();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['add'], { relativeTo: component.route.parent });
  });

  it("should handle payment status from query params", () => {
    const mockRoute = TestBed.inject(ActivatedRoute);
    (mockRoute.snapshot as any).queryParams = {
      status: 'success',
      reference: 'REF123'
    };

    component.ngOnInit();
    expect(component.paymentStatus).toEqual({
      status: 'success',
      reference: 'REF123'
    });
    expect(component.showPaymentStatus).toBeTrue();
  });

  it("should close payment status and clear URL params", () => {
    component.showPaymentStatus = true;
    component.paymentStatus = { status: 'success', reference: 'REF123' };

    component.closePaymentStatus();

    expect(component.showPaymentStatus).toBeFalse();
    expect(component.paymentStatus).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: component.route,
      queryParams: {},
      replaceUrl: true
    });
  });

  it("should verify console logging", () => {
    component.ngOnInit();
    expect(consoleSpy).toHaveBeenCalledWith('Component initialized');
    expect(consoleSpy).toHaveBeenCalledWith('Current URL:', window.location.href);
    expect(consoleSpy).toHaveBeenCalledWith('Query params:', {});
    expect(consoleSpy).toHaveBeenCalledWith('Products in state:', mockProducts);
    expect(consoleSpy).toHaveBeenCalledWith('Paginated Products in state:', mockProducts);
    expect(consoleSpy).toHaveBeenCalledWith('Filtered products:', mockProducts);
    expect(consoleSpy).toHaveBeenCalledWith('Products loaded successfully');
  });
});
