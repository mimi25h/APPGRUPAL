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
  username = '';
  password = '';

  errorMessage = '';
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  submitLogin(form: NgForm) {
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
            this.errorMessage = res.message || 'Invalid login.';
          }
        },
        error: (err) => {
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
