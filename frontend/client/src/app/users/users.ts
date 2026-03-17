import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../core/auth/auth.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users {
  fk_person = '';
  username = '';
  email = '';
  password = '';
  role: 1 | 2 = 2;
  token = '';
  currentRole: 1 | 2 | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  ngOnInit() {
    this.token = this.authService.getToken() ?? '';
    this.currentRole = this.authService.getCurrentRoleFromToken();

    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }

    this.fk_person = this.authService.getCurrentPersonIdFromToken() ?? '';

    if (!this.fk_person || this.currentRole !== 1) {
      this.router.navigate(['/login']);
    }
  }

  createUser(form: NgForm) {
    if (!form.valid || this.currentRole !== 1) {
      return;
    }

    const fk = this.fk_person || this.authService.getCurrentPersonIdFromToken() || '';
    if (!fk) {
      alert('Invalid token, cannot determine the related person.');
      return;
    }

    this.usersService
      .create({
        fk_person: fk,
        username: this.username,
        email: this.email,
        password: this.password,
        role: this.role,
      })
      .subscribe({
        next: () => {
          this.username = '';
          this.email = '';
          this.password = '';
          this.role = 2;
        },
        error: (err) => console.error(err),
      });
  }

  goToPeople() {
    this.router.navigate(['/people']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
