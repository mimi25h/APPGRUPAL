import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private readonly tokenKey = 'token';
  private readonly personIdKey = 'personId';

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  setPersonId(personId: string): void {
    localStorage.setItem(this.personIdKey, personId);
  }

  getPersonId(): string | null {
    return localStorage.getItem(this.personIdKey);
  }

  removePersonId(): void {
    localStorage.removeItem(this.personIdKey);
  }

  clearSession(): void {
    this.removeToken();
    this.removePersonId();
  }
}
