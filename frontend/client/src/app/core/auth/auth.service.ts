import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';

import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';
import {
  ApiResponse,
  JwtPayload,
  PersonLoginData,
  PersonLoginRequest,
  UserLoginData,
  UserLoginRequest,
  UserRole,
} from './auth.types';
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
            this.tokenStorage.removePersonId();
          }
        }),
      );
  }

  loginPerson(payload: PersonLoginRequest) {
    return this.http
      .post<ApiResponse<PersonLoginData>>(`${API_BASE_URL}${API_ENDPOINTS.peopleLogin}`, payload)
      .pipe(
        tap((res) => {
          const personId = res.data?.person?._id;
          if (res.ok && personId) {
            this.tokenStorage.setPersonId(personId);
            this.tokenStorage.removeToken();
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
    return !!this.tokenStorage.getToken() || !!this.tokenStorage.getPersonId();
  }

  getCurrentRoleFromToken(): UserRole | null {
    const payload = this.getTokenPayload();
    return payload?.role ?? null;
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
      const payloadString = atob(tokenParts[1]);
      return JSON.parse(payloadString) as JwtPayload;
    } catch {
      return null;
    }
  }
}
