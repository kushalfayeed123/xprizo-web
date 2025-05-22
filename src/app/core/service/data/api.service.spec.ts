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
import { environment } from "src/environments/environment";

describe("ApiService", () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const API_KEY = "914-bee3ee10-f2fe-4086-a2b5-5cba70d5958f";
  const MOCK_API_URL = "https://test.xprizo.com/api";

  // Helper function to verify API key header
  const verifyApiKeyHeader = (request: any) => {
    const apiKeyHeader = request.headers.get('X-API-KEY');
    expect(apiKeyHeader).toBeTruthy();
    expect(apiKeyHeader).toBe(API_KEY);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        {
          provide: "environment",
          useValue: { apiUrl: MOCK_API_URL }
        }
      ]
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
        id: "1",
        value: "https://new-redirect.com",
      });
    });
  });

  it("should call PUT with default empty body and params", () => {
    const mockResponse = { success: true };

    service.put("/update").subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${MOCK_API_URL}/update`);
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual({}); // ✅ Default body
    expect(req.request.params.keys().length).toBe(0); // ✅ Default params
    verifyApiKeyHeader(req.request);
    expect(req.request.headers.get("Content-Type")).toBe("application/json");
    req.flush(mockResponse);
  });

  it("should call GET with custom query params", () => {
    const mockResponse = { success: true };
    const params = { id: "123" };

    service.get("/test-endpoint", params).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${MOCK_API_URL}/test-endpoint?id=123`);
    expect(req.request.method).toBe("GET");
    expect(req.request.params.get("id")).toBe("123");
    verifyApiKeyHeader(req.request);
    req.flush(mockResponse);
  });

  it("should call GET with no params (default)", () => {
    const mockResponse = { success: true };

    service.get("/test-endpoint").subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${MOCK_API_URL}/test-endpoint`);
    expect(req.request.method).toBe("GET");
    expect(req.request.params.keys().length).toBe(0); // ✅ Covers default empty object
    verifyApiKeyHeader(req.request);
    req.flush(mockResponse);
  });

  it("should call POST with body and correct headers", () => {
    const mockBody = { name: "John" };
    const mockResponse = { success: true };

    service.post("/submit", mockBody).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${MOCK_API_URL}/submit`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(mockBody);
    verifyApiKeyHeader(req.request);
    expect(req.request.headers.get("Content-Type")).toBe("application/json");
    req.flush(mockResponse);
  });

  it("should call POST with default empty body when none is provided", () => {
    const mockResponse = { success: true };

    service.post("/submit").subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${MOCK_API_URL}/submit`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({}); // ✅ Default body branch
    verifyApiKeyHeader(req.request);
    expect(req.request.headers.get("Content-Type")).toBe("application/json");
    req.flush(mockResponse);
  });

  describe("get", () => {
    it("should call GET with correct URL, headers, and params", () => {
      const url = "/test";
      const params = { id: 1 };
      const mockResponse = { data: "test" };

      service.get(url, params).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}${url}?id=1`);
      expect(req.request.method).toBe("GET");
      verifyApiKeyHeader(req.request);
      req.flush(mockResponse);
    });
  });

  describe("post", () => {
    it("should call POST with correct URL, body, and headers", () => {
      const url = "/test";
      const body = { data: "test" };
      const mockResponse = { success: true };

      service.post(url, body).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}${url}`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(body);
      verifyApiKeyHeader(req.request);
      req.flush(mockResponse);
    });
  });

  describe("put", () => {
    it("should call PUT with correct URL, headers, and body", () => {
      const url = "/test";
      const body = { data: "test" };
      const mockResponse = { success: true };

      service.put(url, body).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}${url}`);
      expect(req.request.method).toBe("PUT");
      expect(req.request.body).toEqual(body);
      verifyApiKeyHeader(req.request);
      req.flush(mockResponse);
    });
  });

  // New test to specifically verify API key header in all request types
  describe("API Key Header", () => {
    it("should include X-API-KEY header in all request types", () => {
      // Test GET
      service.get("/test-get").subscribe();
      const getReq = httpMock.expectOne(`${MOCK_API_URL}/test-get`);
      verifyApiKeyHeader(getReq.request);
      getReq.flush({});

      // Test POST
      service.post("/test-post", {}).subscribe();
      const postReq = httpMock.expectOne(`${MOCK_API_URL}/test-post`);
      verifyApiKeyHeader(postReq.request);
      postReq.flush({});

      // Test PUT
      service.put("/test-put", {}).subscribe();
      const putReq = httpMock.expectOne(`${MOCK_API_URL}/test-put`);
      verifyApiKeyHeader(putReq.request);
      putReq.flush({});
    });
  });

  describe("ProductImplementationService", () => {
    let productService: ProductImplementationService;
    let apiService: ApiService;

    beforeEach(() => {
      productService = TestBed.inject(ProductImplementationService);
      apiService = TestBed.inject(ApiService);
    });

    describe("setRedirectUrl", () => {
      it("should always send params with id and value structure", () => {
        const id = "123";
        const url = "https://example.com/redirect";
        const spy = spyOn(apiService, "put").and.returnValue(of(void 0));

        productService.setRedirectUrl(id, url).subscribe();

        expect(spy).toHaveBeenCalledWith(
          "/Item/SetProductRedirectUrl",
          null,
          {
            id: "123",
            value: "https://example.com/redirect"
          }
        );
      });

      it("should handle empty URL", () => {
        const id = "123";
        const url = "";
        const spy = spyOn(apiService, "put").and.returnValue(of(void 0));

        productService.setRedirectUrl(id, url).subscribe();

        expect(spy).toHaveBeenCalledWith(
          "/Item/SetProductRedirectUrl",
          null,
          {
            id: "123",
            value: ""
          }
        );
      });

      it("should handle special characters in URL", () => {
        const id = "123";
        const url = "https://example.com/redirect?param=value&other=123";
        const spy = spyOn(apiService, "put").and.returnValue(of(void 0));

        productService.setRedirectUrl(id, url).subscribe();

        expect(spy).toHaveBeenCalledWith(
          "/Item/SetProductRedirectUrl",
          null,
          {
            id: "123",
            value: "https://example.com/redirect?param=value&other=123"
          }
        );
      });

      it("should maintain parameter structure even with invalid inputs", () => {
        const id = "123";
        const url = null as any;
        const spy = spyOn(apiService, "put").and.returnValue(of(void 0));

        productService.setRedirectUrl(id, url).subscribe();

        expect(spy).toHaveBeenCalledWith(
          "/Item/SetProductRedirectUrl",
          null,
          {
            id: "123",
            value: null
          }
        );
      });
    });
  });
});
