import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiService } from "../api.service";
import { Product } from "src/app/core/models/product.model";
import { ProductPayload } from "src/app/core/models/product-payload.model";
import { API_ENDPOINTS } from "src/app/core/config/api-endpoints";

@Injectable({
  providedIn: "root",
})
export class ProductImplementationService {
  constructor(private apiService: ApiService) {}

  getProducts(): Observable<Product[]> {
    return this.apiService.get(API_ENDPOINTS.PRODUCTS.LIST).pipe(
      map((response: any) => {
        return response.map((item: any) => this.mapFields(item));
      })
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.apiService.get(API_ENDPOINTS.PRODUCTS.GET(id)).pipe(
      map((response: any) => {
        return this.mapFields(response);
      })
    );
  }

  addProduct(payload: ProductPayload): Observable<void> {
    return this.apiService.post(API_ENDPOINTS.PRODUCTS.ADD, payload);
  }

  setRedirectUrl(id: string, url: string): Observable<void> {
    return this.apiService.put(API_ENDPOINTS.PRODUCTS.SET_REDIRECT_URL, null, {
      id,
      value: url,
    });
  }

  private mapFields(item: any): Product {
    return {
      id: item.id,
      description: item.description,
      contactId: item.contactId,
      userName: item.userName,
      amount: item.amount,
      currencyCode: item.currencyCode,
      symbol: item.symbol,
      reference: item.reference,
      routingCode: item.routingCode,
      token: item.token,
      paymentUrl: item.paymentUrl,
      redirectUrl: item.redirectUrl,
      isInactive: item.isInactive,
      imageUrl: "./assets/images/product-1.jpg",
    };
  }
}
