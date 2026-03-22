import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // This guard only checks if there is an active authenticated session.
    // Use it for routes that any logged-in role can access.
    if (!this.authService.isAuthenticated()) {
      console.warn('Access denied. User is not authenticated.');
      this.router.navigate(['/login']);
      return false;
    }

    // Session is valid, allow route activation.
    return true;
  }
}
