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
  // HTTP client and token storage abstraction used by auth flows.
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  loginUser(payload: UserLoginRequest) {
    // Calls login endpoint and persists JWT if the response is successful.
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

  // Clears current session token.
  logout(): void {
    this.tokenStorage.clearSession();
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  isAuthenticated(): boolean {
    // No token means no active session.
    const token = this.tokenStorage.getToken();
    if (!token) {
      return false;
    }

    // Invalid token format/payload is treated as an expired session.
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

    // Remove stale token when expiration is reached.
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

  // Decodes JWT payload section (Base64URL) and parses it into a typed object.
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

  // Converts Base64URL into plain Base64 so browser atob can decode it.
  private decodeBase64Url(value: string): string {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return atob(padded);
  }

  deleteUser() {
    // Sends authenticated delete request for current user endpoint.
    const token = this.getToken();

    return this.http.delete(`${API_BASE_URL}${API_ENDPOINTS.usersDeleteMe}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getLinkedUsersCount() {
    // Gets the list of users linked to the current person.
    const token = this.getToken();

    return this.http.get<{ users: Array<{ username: string; email: string; role: number }> }>(`${API_BASE_URL}${API_ENDPOINTS.linkedUsersCount}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
