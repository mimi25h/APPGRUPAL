import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule, NgIf],
})
export class PersonLogin {
  // PERSON LOGIN
  document = '';

  // USER LOGIN
  username = '';
  password = '';

  errorMessage = '';
  isLoggedIn = false;

  private readonly authService = inject(AuthService);

  constructor(private router: Router) {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  // PERSON LOGIN
  submitLogin(form: NgForm) {
    this.errorMessage = '';

    if (!form.valid) {
      this.errorMessage = 'Please enter a valid document.';
      return;
    }

    this.authService.loginPerson({ document: this.document }).subscribe({
      next: (res) => {
        if (res.ok && res.data) {
          this.isLoggedIn = true;
          this.router.navigate(['/people']);
        } else {
          this.errorMessage = res.message || 'Document not found.';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Server error';
      },
    });
  }

  // USER LOGIN
  submitUserLogin(form: NgForm) {
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
            this.router.navigate(['/people']);
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
