import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProductLayoutComponent } from "./product-layout.component";
import { NgxsModule, Store } from "@ngxs/store";
import { ProductsState } from "src/app/state/products/products.state";
import { Products } from "src/app/state/products/products.actions";
import { of } from "rxjs";

describe("ProductLayoutComponent", () => {
  let component: ProductLayoutComponent;
  let fixture: ComponentFixture<ProductLayoutComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ProductsState])],
      declarations: [ProductLayoutComponent]
    }).compileComponents();

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue(of(undefined));

    fixture = TestBed.createComponent(ProductLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have current year", () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });
});
