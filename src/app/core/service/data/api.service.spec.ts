// src/app/core/api.service.spec.ts
import { TestBed } from "@angular/core/testing";
import { ApiService } from "./api.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { HttpHeaders } from "@angular/common/http";
import { of } from "rxjs";
import { ProductImplementationService } from "./product/product.implementation.service";

describe("ApiService", () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const BASE_URL = "https://test.xprizo.com/api";
  const API_KEY = "YOUR_API_KEY_HERE";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched requests
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call ApiService.put with correct URL and params", () => {
    const apiService = TestBed.inject(ApiService);
    const spy = spyOn(apiService, "put").and.returnValue(of(void 0));
    const service = TestBed.inject(ProductImplementationService);

    const id = "1";
    const redirectUrl = "https://new-redirect.com";

    service.setRedirectUrl(id, redirectUrl).subscribe(() => {
      expect(spy).toHaveBeenCalledWith("/Item/SetProductRedirectUrl", null, {
        productId: "1",
        value: "https://new-redirect.com",
      });
    });
  });

  it("should call PUT with default empty body and params", () => {
    const mockResponse = { success: true };

    service.put("/update").subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/update`);
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual({}); // ✅ Default body
    expect(req.request.params.keys().length).toBe(0); // ✅ Default params
    expect(req.request.headers.get("x-api-key")).toBe(API_KEY);
    expect(req.request.headers.get("Content-Type")).toBe("application/json");
    req.flush(mockResponse);
  });

  it("should call GET with custom query params", () => {
    const mockResponse = { success: true };
    const params = { id: "123" };

    service.get("/test-endpoint", params).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/test-endpoint?id=123`);
    expect(req.request.method).toBe("GET");
    expect(req.request.params.get("id")).toBe("123");
    req.flush(mockResponse);
  });

  it("should call GET with no params (default)", () => {
    const mockResponse = { success: true };

    service.get("/test-endpoint").subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/test-endpoint`);
    expect(req.request.method).toBe("GET");
    expect(req.request.params.keys().length).toBe(0); // ✅ Covers default empty object
    req.flush(mockResponse);
  });

  it("should call POST with body and correct headers", () => {
    const mockBody = { name: "John" };
    const mockResponse = { success: true };

    service.post("/submit", mockBody).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/submit`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(mockBody);
    expect(req.request.headers.get("x-api-key")).toBe(API_KEY);
    expect(req.request.headers.get("Content-Type")).toBe("application/json");
    req.flush(mockResponse);
  });

  it("should call POST with default empty body when none is provided", () => {
    const mockResponse = { success: true };

    service.post("/submit").subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/submit`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({}); // ✅ Default body branch
    expect(req.request.headers.get("x-api-key")).toBe(API_KEY);
    expect(req.request.headers.get("Content-Type")).toBe("application/json");
    req.flush(mockResponse);
  });

  describe("get", () => {
    it("should call GET with correct URL, headers, and params", () => {
      const mockResponse = { success: true };
      const params = { id: "123" };

      service.get("/test-endpoint", params).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/test-endpoint?id=123`);
      expect(req.request.method).toBe("GET");
      expect(req.request.headers.get("x-api-key")).toBe(API_KEY);
      expect(req.request.headers.get("Content-Type")).toBe("application/json");
      req.flush(mockResponse);
    });
  });

  describe("post", () => {
    it("should call POST with correct URL, body, and headers", () => {
      const mockBody = { name: "test" };
      const mockResponse = { success: true };

      service.post("/create", mockBody).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/create`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(mockBody);
      expect(req.request.headers.get("x-api-key")).toBe(API_KEY);
      expect(req.request.headers.get("Content-Type")).toBe("application/json");
      req.flush(mockResponse);
    });
  });

  describe("put", () => {
    it("should call PUT with correct URL, headers, and body", () => {
      const mockBody = { status: "active" };
      const mockResponse = { success: true };

      service.put("/update", mockBody).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/update`);
      expect(req.request.method).toBe("PUT");
      expect(req.request.body).toEqual(mockBody);
      expect(req.request.headers.get("x-api-key")).toBe(API_KEY);
      expect(req.request.headers.get("Content-Type")).toBe("application/json");
      req.flush(mockResponse);
    });
  });
});
