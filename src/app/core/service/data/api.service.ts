// src/app/core/api.service.ts
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, Inject } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class ApiService {
  private readonly API_KEY = "914-bee3ee10-f2fe-4086-a2b5-5cba70d5958f";

  constructor(
    private http: HttpClient,
    @Inject("environment") private env: typeof environment
  ) {}

  get<T>(url: string, params: any = {}) {
    return this.http.get<T>(`${this.env.apiUrl}${url}`, {
      headers: this.getHeaders(),
      params,
    });
  }

  post<T>(url: string, body: any = {}) {
    return this.http.post<T>(`${this.env.apiUrl}${url}`, body, {
      headers: this.getHeaders(),
    });
  }
  
  put<T>(url: string, body: any = {}, params: any = {}) {
    return this.http.put<T>(`${this.env.apiUrl}${url}`, body, {
      headers: this.getHeaders(),
      params,
    });
  }

  private getHeaders() {
    return new HttpHeaders({
      "X-API-KEY": this.API_KEY,
      "Content-Type": "application/json",
    });
  }
}
