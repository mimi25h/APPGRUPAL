import { environment } from '../../../environments/environment';

export const API_BASE_URL = environment.apiBaseUrl;

export const API_ENDPOINTS = {
  usersLogin: '/auth/login',
  bootstrapAdmin: '/auth/bootstrap-admin',
} as const;
