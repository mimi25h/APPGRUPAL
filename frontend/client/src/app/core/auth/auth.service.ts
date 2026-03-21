import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';
import { ApiResponse, JwtPayload, UserLoginData, UserLoginRequest, UserRole } from './auth.types';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  loginUser(payload: UserLoginRequest) {
    return this.http
      .post<ApiResponse<UserLoginData>>(`${API_BASE_URL}${API_ENDPOINTS.usersLogin}`, payload)
      .pipe(
        tap((res) => {
          const token = res.data?.token;
          if (res.ok && token) {
            this.tokenStorage.setToken(token);
          }
        }),
      );
  }

  logout(): void {
    this.tokenStorage.clearSession();
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  isAuthenticated(): boolean {
    const token = this.tokenStorage.getToken();
    if (!token) {
      return false;
    }

    const payload = this.getTokenPayload();
    if (!payload) {
      this.tokenStorage.clearSession();
      return false;
    }

    // If exp is not present, treat token as valid structurally.
    if (!payload.exp) {
      return true;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const isValid = payload.exp > nowInSeconds;

    if (!isValid) {
      this.tokenStorage.clearSession();
    }

    return isValid;
  }

  getCurrentRoleFromToken(): UserRole | null {
    const payload = this.getTokenPayload();
    return payload?.role ?? null;
  }

  getCurrentUserIdFromToken(): string | null {
    const payload = this.getTokenPayload();
    return payload?.userId ?? null;
  }

  getCurrentPersonIdFromToken(): string | null {
    const payload = this.getTokenPayload();
    return payload?.personId ?? null;
  }

  private getTokenPayload(): JwtPayload | null {
    const token = this.tokenStorage.getToken();
    if (!token) {
      return null;
    }

    const tokenParts = token.split('.');
    if (tokenParts.length < 2) {
      return null;
    }

    try {
      const payloadString = this.decodeBase64Url(tokenParts[1]);
      return JSON.parse(payloadString) as JwtPayload;
    } catch {
      return null;
    }
  }

  private decodeBase64Url(value: string): string {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return atob(padded);
  }

  deleteUser() {
  const token = this.getToken();

  return this.http.delete(`${API_BASE_URL}${API_ENDPOINTS.usersDeleteMe}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  }

}
