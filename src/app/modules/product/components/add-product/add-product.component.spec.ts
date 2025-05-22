import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddProductComponent } from "./add-product.component";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { of } from "rxjs";
import { Products } from "src/app/state/products/products.actions";
import { NgxsModule } from "@ngxs/store";
import { ProductsState } from "src/app/state/products/products.state";
import { FormsModule } from "@angular/forms";

describe("AddProductComponent", () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj("Router", ["navigate"]);
    mockStore = jasmine.createSpyObj("Store", ["dispatch"]);
    mockStore.dispatch.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ProductsState]),
        FormsModule
      ],
      declarations: [AddProductComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should have default product values", () => {
    expect(component.product.currencyCode).toBe("EUR");
    expect(component.product.reference).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(component.product.description).toBe("");
    expect(component.product.amount).toBe(0);
  });

  it("should set success to true when addProduct() is called", () => {
    component.product.description = "Test Product";
    component.product.amount = 100;
    
    component.addProduct();
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      new Products.AddProduct(component.product)
    );
    expect(component.success).toBeTrue();
  });

  it("should not dispatch if form is invalid", () => {
    component.product.description = "";
    component.product.amount = 0;
    
    component.addProduct();
    
    expect(mockStore.dispatch).not.toHaveBeenCalled();
    expect(component.success).toBeFalse();
  });

  it("should navigate back to products", () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/products"]);
  });
});
