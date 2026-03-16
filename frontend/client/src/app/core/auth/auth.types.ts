export type UserRole = 1 | 2;

export interface JwtPayload {
  id?: string;
  role?: UserRole;
  iat?: number;
  exp?: number;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface PersonLoginRequest {
  document: string;
}

export interface UserLoginData {
  token: string;
}

export interface PersonLoginData {
  person: {
    _id: string;
    document?: string;
  };
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  message?: string;
}
