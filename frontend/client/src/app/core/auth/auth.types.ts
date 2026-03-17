export type UserRole = 1 | 2;

export interface JwtPayload {
  userId?: string;
  personId?: string;
  role?: UserRole;
  iat?: number;
  exp?: number;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserLoginData {
  token: string;
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  message?: string;
}
