import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { ProductImplementationService } from "./product.implementation.service";
import { ApiService } from "../api.service";
import { Product } from "src/app/core/models/product.model";
import { ProductPayload } from "src/app/core/models/product-payload.model";
import { API_ENDPOINTS } from "src/app/core/config/api-endpoints";

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
    isInactive: false,
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
        expect(apiService.get).toHaveBeenCalledWith(API_ENDPOINTS.PRODUCTS.LIST);
        expect(products.length).toBe(1);
        expect(products[0].id).toBe(1);
        expect(products[0].description).toBe("Product 1");
        done();
      });
    });
  });

  describe("getProduct", () => {
    it("should call ApiService.get with correct params and return a mapped product", () => {
      const testProduct = {
        id: 1,
        description: "Test Product",
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
        imageUrl: "./assets/images/product-1.jpg"
      };

      apiService.get.and.returnValue(of(testProduct));

      service.getProduct(1).subscribe((result) => {
        expect(result).toEqual(testProduct);
        expect(apiService.get).toHaveBeenCalledWith(API_ENDPOINTS.PRODUCTS.GET(1));
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
          API_ENDPOINTS.PRODUCTS.ADD,
          payload
        );
        done();
      });
    });
  });

  describe("setRedirectUrl", () => {
    it("should call ApiService.put with correct URL and parameters", () => {
      const id = "1";
      const redirectUrl = "https://new-redirect.com";

      service.setRedirectUrl(id, redirectUrl).subscribe(() => {
        expect(apiService.put).toHaveBeenCalledWith(
          API_ENDPOINTS.PRODUCTS.SET_REDIRECT_URL,
          null,
          {
            id: "1",
            value: "https://new-redirect.com",
          }
        );
      });
    });
  });
});
