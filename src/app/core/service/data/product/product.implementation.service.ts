import { Injectable } from "@angular/core";
import { ProductAbstractionService } from "./product.abstraction.service";
import { ObservedValueOf, Observable, map, of } from "rxjs";
import { Product } from "src/app/core/models/product.model";
import { ApiService } from "../api.service";
import { ProductPayload } from "src/app/core/models/product-payload.model";

@Injectable({
  providedIn: "root",
})
export class ProductImplementationService implements ProductAbstractionService {
  constructor(private api: ApiService) {}

  products: Product[] = [
    {
      id: 1,
      description: "Premium Subscription",
      contactId: 101,
      userName: "JohnDoe",
      amount: 49.99,
      currencyCode: "USD",
      symbol: "$",
      reference: "SUB123456",
      routingCode: "RT001",
      token: "abc123",
      paymentUrl: "https://payment.example.com",
      redirectUrl: "https://app.example.com/thank-you",
      isInactive: "false",
    },
    {
      id: 2,
      description: "Digital Marketing Toolkit",
      contactId: 102,
      userName: "JaneSmith",
      amount: 99.0,
      currencyCode: "USD",
      symbol: "$",
      reference: "DMK2023",
      routingCode: "RT002",
      token: "xyz789",
      paymentUrl: "https://payment.example.com",
      redirectUrl: "https://app.example.com/thank-you",
      isInactive: "false",
    },
    {
      id: 2,
      description: "Digital Marketing Toolkit",
      contactId: 102,
      userName: "JaneSmith",
      amount: 99.0,
      currencyCode: "USD",
      symbol: "$",
      reference: "DMK2023",
      routingCode: "RT002",
      token: "xyz789",
      paymentUrl: "https://payment.example.com",
      redirectUrl: "https://app.example.com/thank-you",
      isInactive: "false",
    },
    {
      id: 2,
      description: "Digital Marketing Toolkit",
      contactId: 102,
      userName: "JaneSmith",
      amount: 99.0,
      currencyCode: "USD",
      symbol: "$",
      reference: "DMK2023",
      routingCode: "RT002",
      token: "xyz789",
      paymentUrl: "https://payment.example.com",
      redirectUrl: "https://app.example.com/thank-you",
      isInactive: "false",
    },
    {
      id: 2,
      description: "Digital Marketing Toolkit",
      contactId: 102,
      userName: "JaneSmith",
      amount: 99.0,
      currencyCode: "USD",
      symbol: "$",
      reference: "DMK2023",
      routingCode: "RT002",
      token: "xyz789",
      paymentUrl: "https://payment.example.com",
      redirectUrl: "https://app.example.com/thank-you",
      isInactive: "false",
    },
    {
      id: 2,
      description: "Digital Marketing Toolkit",
      contactId: 102,
      userName: "JaneSmith",
      amount: 99.0,
      currencyCode: "USD",
      symbol: "$",
      reference: "DMK2023",
      routingCode: "RT002",
      token: "xyz789",
      paymentUrl: "https://payment.example.com",
      redirectUrl: "https://app.example.com/thank-you",
      isInactive: "false",
    },
    {
      id: 2,
      description: "Digital Marketing Toolkit",
      contactId: 102,
      userName: "JaneSmith",
      amount: 99.0,
      currencyCode: "USD",
      symbol: "$",
      reference: "DMK2023",
      routingCode: "RT002",
      token: "xyz789",
      paymentUrl: "https://payment.example.com",
      redirectUrl: "https://app.example.com/thank-you",
      isInactive: "false",
    },
    {
      id: 2,
      description: "Digital Marketing Toolkit",
      contactId: 102,
      userName: "JaneSmith",
      amount: 99.0,
      currencyCode: "USD",
      symbol: "$",
      reference: "DMK2023",
      routingCode: "RT002",
      token: "xyz789",
      paymentUrl: "https://payment.example.com",
      redirectUrl: "https://app.example.com/thank-you",
      isInactive: "false",
    },
    {
      id: 2,
      description: "Digital Marketing Toolkit",
      contactId: 102,
      userName: "JaneSmith",
      amount: 99.0,
      currencyCode: "USD",
      symbol: "$",
      reference: "DMK2023",
      routingCode: "RT002",
      token: "xyz789",
      paymentUrl: "https://payment.example.com",
      redirectUrl: "https://app.example.com/thank-you",
      isInactive: "false",
    },
    {
      id: 2,
      description: "Digital Marketing Toolkit",
      contactId: 102,
      userName: "JaneSmith",
      amount: 99.0,
      currencyCode: "USD",
      symbol: "$",
      reference: "DMK2023",
      routingCode: "RT002",
      token: "xyz789",
      paymentUrl: "https://payment.example.com",
      redirectUrl: "https://app.example.com/thank-you",
      isInactive: "false",
    },
    // More products...
  ];

  selectedProduct: Product = {
    id: 2,
    description: "Digital Marketing Toolkit",
    contactId: 102,
    userName: "JaneSmith",
    amount: 99.0,
    currencyCode: "USD",
    symbol: "$",
    reference: "DMK2023",
    routingCode: "RT002",
    token: "xyz789",
    paymentUrl: "https://payment.example.com",
    redirectUrl: "https://app.example.com/thank-you",
    isInactive: "false",
  };

  getProducts(): Observable<Product[]> {
    // return of(this.products);
    return this.api
      .get<Product[]>("/Item/ProductList")
      .pipe(map((response) => mappedProduct(response) as Product[]));
  }

  getProduct(id: number): Observable<Product> {
    // return of(this.selectedProduct);
    const params: any = { id };
    return this.api
      .get<Product>("/Item/GetProduct", params)
      .pipe(map((response) => mappedProduct(response) as Product));
  }

  addProduct(payload: ProductPayload): Observable<void> {
    return this.api.post("/Item/AddProduct", payload);
  }

  setRedirectUrl(id: string, url: string): Observable<void> {
    const params: any = { productId: id, value: url };
    return this.api.put("/Item/SetProductRedirectUrl", null, params);
  }
}

function mappedProduct(response: Product[] | Product): Product[] | Product {
  if (Array.isArray(response)) {
    return response.map((e) => mapFields(e));
  } else {
    return mapFields(response);
  }
}

function mapFields(e: Product): Product {
  return {
    id: e.id,
    description: e.description,
    contactId: e.contactId,
    userName: e.userName,
    amount: e.amount,
    currencyCode: e.currencyCode,
    symbol: e.symbol,
    reference: e.reference,
    routingCode: e.routingCode,
    token: e.token,
    paymentUrl: e.paymentUrl,
    redirectUrl: e.redirectUrl,
    isInactive: e.isInactive,
  };
}
