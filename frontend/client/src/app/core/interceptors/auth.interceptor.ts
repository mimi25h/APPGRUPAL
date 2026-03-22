import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

// HTTP interceptor that adds Bearer token to protected requests and handles 401 cleanup.
// Public endpoints that do not require an Authorization header
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/bootstrap-admin'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const isPublic = PUBLIC_ENDPOINTS.some((path) => req.url.includes(path));

  // If there is no token or the route is public, forward the request unmodified
  if (!token || isPublic) {
    return next(req);
  }

  // Clone the request and attach the Authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Invalid or expired session: clear stored token
        auth.logout();
      }
      return throwError(() => error);
    }),
  );
};
