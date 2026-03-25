import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <div class="profile-container">
      <h1>Welcome to APPGRUPAL</h1>
      <div class="delete-container">
        <button class="delete-btn" (click)="deleteAccount()">Delete Account</button>
      </div>
    </div>
  `,
  styleUrls: ['./profile.css'],
})
export class Profile {
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  deleteAccount() {
    this.authService.deleteUser().subscribe({
      next: () => {
        console.log('User deleted');
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Delete failed', err);
      },
    });
  }
}
