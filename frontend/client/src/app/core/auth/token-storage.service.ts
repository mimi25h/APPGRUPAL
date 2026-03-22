import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// Thin wrapper around localStorage for JWT session persistence.
export class TokenStorageService {
  private readonly tokenKey = 'token';

  // JWT session storage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Session helper
  isUserLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Session cleanup
  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
