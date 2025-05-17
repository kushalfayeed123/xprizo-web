import { Injectable } from "@angular/core";
import { Observable, ObservedValueOf } from "rxjs";
import { ProductPayload } from "src/app/core/models/product-payload.model";
import { Product } from "src/app/core/models/product.model";

@Injectable({
  providedIn: "root",
})
export abstract class ProductAbstractionService {
  abstract getProducts(): Observable<Product[]>;
  abstract getProduct(id: number): Observable<Product>;
  abstract addProduct(payload: ProductPayload): Observable<void>;
  abstract setRedirectUrl(id: string, url: string): Observable<void>;
}
