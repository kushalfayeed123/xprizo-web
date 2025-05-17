import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProductDetailComponent } from "./product-detail.component";
import { NgxsModule, Store } from "@ngxs/store";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { ProductsState } from "src/app/state/products/products.state";
import { Product } from "src/app/core/models/product.model";

describe("ProductDetailComponent", () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let store: Store;

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
    isInactive: "",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      declarations: [ProductDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: "123" }),
            snapshot: {
              paramMap: {
                get: (key: string) => "123",
              },
            },
          },
        },
        {
          provide: Store,
          useValue: {
            select: jasmine.createSpy().and.returnValue(of(mockProduct)),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should subscribe to selectedProduct and update product", () => {
    expect(store.select).toHaveBeenCalledWith(ProductsState.selectedProduct);
    expect(component.product).toEqual(mockProduct);
  });
});
