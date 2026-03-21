import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="landing-container">
      <h1>Welcome to APPGRUPAL</h1>
      <p>Please log in to continue.</p>
      <a routerLink="/login"><button>Go to Login</button></a>
      <div class="delete-container">
      <button class="delete-btn"  (click)="deleteAccount()">delete account</button>
      </div>
    </div>
  `,
  styleUrls: ['./landing.css']
})

export class Landing {
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
      }
    });
  }
}