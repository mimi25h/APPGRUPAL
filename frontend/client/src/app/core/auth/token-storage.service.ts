import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private readonly tokenKey = 'token';
  private readonly personKey = 'personId';

  // --- USER (JWT) ---
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.removeItem(this.personKey); // 🔥 prevent mix
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // --- PERSON ---
  setPersonId(id: string): void {
    localStorage.setItem(this.personKey, id);
    localStorage.removeItem(this.tokenKey);
  }

  getPersonId(): string | null {
    return localStorage.getItem(this.personKey);
  }

  removePersonId(): void {
    localStorage.removeItem(this.personKey);
  }

  // --- HELPERS ---
  isUserLoggedIn(): boolean {
    return !!this.getToken();
  }

  isPersonLoggedIn(): boolean {
    return !!this.getPersonId();
  }

  // --- LOGOUT ---
  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.personKey);
  }
}
