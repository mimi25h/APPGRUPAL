import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Step 1: require an authenticated user.
    if (!this.authService.isAuthenticated()) {
      console.warn('Access denied. User is not authenticated.');
      this.router.navigate(['/login']);
      return false;
    }

    // Step 2: require admin role (role === 1).
    const currentRole = this.authService.getCurrentRoleFromToken();
    if (currentRole !== 1) {
      console.warn('Access denied. User is not an admin.');
      if (currentRole === 2) {
        this.router.navigate(['/modalities']);
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }

    // User is authenticated and authorized as admin.
    return true;
  }
}
