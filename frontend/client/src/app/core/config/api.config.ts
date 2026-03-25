import { environment } from '../../../environments/environment';

// Base URL for all backend requests
export const API_BASE_URL = environment.apiBaseUrl; 
// make sure environment.apiBaseUrl ends with "/api", e.g. "http://localhost:5000/api"

// Centralized endpoint paths used by auth-related services
export const API_ENDPOINTS = {
  usersLogin: '/auth/login',        // will resolve to http://localhost:5000/api/auth/login
  usersDeleteMe: '/auth/delete-me',
  bootstrapAdmin: '/auth/bootstrap-admin',
} as const;