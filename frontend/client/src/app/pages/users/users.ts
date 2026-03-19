import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  createUser(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const fk = this.fk_person.trim();
    if (!fk) {
      alert('Person ID is required to create a user.');
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
