import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { filter, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from './core/auth/auth.service';
import { UserRole } from './core/auth/auth.types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatToolbar, MatButton],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  // Shared auth state used by top-level navigation.
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly title = signal('client');
  protected isAuthenticated = false;
  protected currentRole: UserRole | null = null;

  ngOnInit(): void {
    // Refresh auth state whenever navigation completes to keep menu visibility in sync.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.refreshSessionState());
  }

  // Role helpers used by template conditionals.
  protected get isAdmin(): boolean {
    return this.currentRole === 1;
  }

  protected get isViewer(): boolean {
    return this.currentRole === 2;
  }

  protected logout(): void {
    // Centralized logout flow from global navbar.
    this.authService.logout();
    this.refreshSessionState();
    this.router.navigate(['/login']);
  }

  private refreshSessionState(): void {
    // Resolve current auth/role values from token storage.
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentRole = this.isAuthenticated ? this.authService.getCurrentRoleFromToken() : null;
  }
}
