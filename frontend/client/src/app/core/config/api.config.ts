import { environment } from '../../../environments/environment';

export const API_BASE_URL = environment.apiBaseUrl;

export const API_ENDPOINTS = {
  usersLogin: '/api/users/login',
  peopleLogin: '/api/people/login',
} as const;
