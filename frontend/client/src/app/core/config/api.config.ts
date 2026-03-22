import { environment } from '../../../environments/environment';

// Base URL for all backend requests.
export const API_BASE_URL = environment.apiBaseUrl;

// Centralized endpoint paths used by auth-related services.
export const API_ENDPOINTS = {
  usersLogin: '/auth/login',
  usersDeleteMe: '/auth/delete',
  bootstrapAdmin: '/auth/bootstrap-admin',
} as const;
