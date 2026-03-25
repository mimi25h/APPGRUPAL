// Supported application roles from backend authorization model.
export type UserRole = 1 | 2;

// JWT payload shape expected from backend token signing.
export interface JwtPayload {
  userId?: string;
  personId?: string;
  role?: UserRole;
  iat?: number;
  exp?: number;
}

// Login request contract.
export interface UserLoginRequest {
  username: string;
  password: string;
}

// Login response data contract.
export interface UserLoginData {
  token: string;
}

// Generic API envelope used by backend endpoints.
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  message?: string;
}
