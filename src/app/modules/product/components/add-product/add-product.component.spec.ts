import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddProductComponent } from "./add-product.component";
import { NgxsModule } from "@ngxs/store";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

describe("AddProductComponent", () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), FormsModule, RouterTestingModule],
      declarations: [AddProductComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, "navigate");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default product values", () => {
    expect(component.product).toEqual({
      description: "",
      amount: 0,
      currencyCode: "USD",
      symbol: "$",
      userName: "",
    });
  });

  it("should set success to true when addProduct() is called", () => {
    component.success = false;
    component.addProduct();
    expect(component.success).toBeTrue();
  });

  it("should navigate to /products when goBack() is called", () => {
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(["/products"]);
  });
});
