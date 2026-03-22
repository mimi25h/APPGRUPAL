import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule, NgIf],
})
export class Login {
  // Form model fields bound from template.
  username = '';
  password = '';

  errorMessage = '';
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    // Detect pre-existing valid session.
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  submitLogin(form: NgForm) {
    // Basic client-side validation before calling backend.
    this.errorMessage = '';

    if (!form.valid) {
      this.errorMessage = 'Enter username and password.';
      return;
    }

    this.authService
      .loginUser({
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          if (res.ok && res.data) {
            this.isLoggedIn = true;
            const role = this.authService.getCurrentRoleFromToken();

            // Route users by role after successful authentication.
            if (role === 1) {
              this.router.navigate(['/people']);
              return;
            }

            if (role === 2) {
              this.router.navigate(['/modalities']);
              return;
            }

            this.errorMessage = 'Role not allowed.';
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            // Backend-level validation/auth errors.
            this.errorMessage = res.message || 'Invalid login.';
          }
        },
        error: (err) => {
          // Network/server fallback message.
          this.errorMessage = err.error?.message || 'Server error';
        },
      });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
