import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProductLayoutComponent } from "./product-layout.component";
import { NgxsModule, Store } from "@ngxs/store";
import { RouterTestingModule } from "@angular/router/testing";
import { Products } from "src/app/state/products/products.actions";

describe("ProductLayoutComponent", () => {
  let component: ProductLayoutComponent;
  let fixture: ComponentFixture<ProductLayoutComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), RouterTestingModule],
      declarations: [ProductLayoutComponent],
    }).compileComponents();

    store = TestBed.inject(Store);
    spyOn(store, "dispatch").and.callThrough();

    fixture = TestBed.createComponent(ProductLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch Products.LoadProducts action on init", () => {
    expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(Products.LoadProducts));
  });

  it("should set currentYear to current year", () => {
    const year = new Date().getFullYear();
    expect(component.currentYear).toBe(year);
  });
});
