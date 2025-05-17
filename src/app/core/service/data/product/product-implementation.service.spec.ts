import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { ProductImplementationService } from "./product.implementation.service";
import { ApiService } from "../api.service";
import { Product } from "src/app/core/models/product.model";
import { ProductPayload } from "src/app/core/models/product-payload.model";

// Sample mock product data
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
  },
];

const mockProduct: Product = mockProducts[0];

// Mock ApiService
class MockApiService {
  get = jasmine.createSpy().and.returnValue(of(mockProducts));
  post = jasmine.createSpy().and.returnValue(of(void 0));
  put = jasmine.createSpy().and.returnValue(of(void 0));
}

describe("ProductImplementationService", () => {
  let service: ProductImplementationService;
  let apiService: MockApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductImplementationService,
        { provide: ApiService, useClass: MockApiService },
      ],
    });

    service = TestBed.inject(ProductImplementationService);
    apiService = TestBed.inject(ApiService) as any;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getProducts", () => {
    it("should call ApiService.get with the correct URL and return mapped products", (done) => {
      apiService.get.and.returnValue(of(mockProducts));

      service.getProducts().subscribe((products) => {
        expect(apiService.get).toHaveBeenCalledWith("/Item/ProductList");
        expect(products.length).toBe(1);
        expect(products[0].id).toBe(1);
        expect(products[0].description).toBe("Product 1");
        done();
      });
    });
  });

  describe("getProduct", () => {
    it("should call ApiService.get with correct params and return a mapped product", (done) => {
      apiService.get.and.returnValue(of(mockProduct));

      service.getProduct(1).subscribe((product) => {
        expect(apiService.get).toHaveBeenCalledWith("/Item/GetProduct", {
          id: 1,
        });
        expect(product.id).toBe(1);
        expect(product.description).toBe("Product 1");
        done();
      });
    });
  });

  describe("addProduct", () => {
    it("should call ApiService.post with correct URL and payload", (done) => {
      const payload: ProductPayload = {
        amount: 100,
        reference: "test reference ",
        description: "New Product",
        currencyCode: "USD",
      };

      service.addProduct(payload).subscribe(() => {
        expect(apiService.post).toHaveBeenCalledWith(
          "/Item/AddProduct",
          payload
        );
        done();
      });
    });
  });

  describe("setRedirectUrl", () => {
    it("should call ApiService.put with correct URL and parameters", (done) => {
      service.setRedirectUrl("1", "https://new-redirect.com").subscribe(() => {
        expect(apiService.put).toHaveBeenCalledWith(
          "/Item/SetProductRedirectUrl",
          null,
          {
            productId: "1",
            value: "https://new-redirect.com",
          }
        );
        done();
      });
    });
  });
});
