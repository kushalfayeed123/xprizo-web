import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  navigateToUrl(url: string): void {
    window.location.href = url;
  }
} 