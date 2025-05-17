// src/app/core/api.service.ts
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ApiService {
  private readonly BASE_URL = "https://test.xprizo.com/api";
  private readonly API_KEY = "YOUR_API_KEY_HERE";

  constructor(private http: HttpClient) {}

  get<T>(url: string, params: any = {}) {
    return this.http.get<T>(`${this.BASE_URL}${url}`, {
      headers: this.getHeaders(),
      params,
    });
  }

  post<T>(url: string, body: any = {}) {
    return this.http.post<T>(`${this.BASE_URL}${url}`, body, {
      headers: this.getHeaders(),
    });
  }
  put<T>(url: string, params: any = {}) {
    return this.http.put<T>(`${this.BASE_URL}${url}`, {
      headers: this.getHeaders(),
      params,
    });
  }

  private getHeaders() {
    return new HttpHeaders({
      "x-api-key": this.API_KEY,
      "Content-Type": "application/json",
    });
  }
}
