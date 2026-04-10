import { environment } from '../../../environments/environment';

// Base URL for all backend requests
export const API_BASE_URL = environment.apiBaseUrl;
// make sure environment.apiBaseUrl points to the backend root, e.g. "http://localhost:3000"

// Centralized endpoint paths used by auth-related services
export const API_ENDPOINTS = {
  usersLogin: '/auth/login', // will resolve to http://localhost:3000/auth/login
  usersDeleteMe: '/auth/delete-me',
  linkedUsersCount: '/auth/linked-users-count',
  bootstrapAdmin: '/auth/bootstrap-admin',
} as const;
