import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule, NgIf]
})
export class PersonLogin {

  // PERSON LOGIN
  document = signal('');

  // USER LOGIN
  username = signal('');
  password = signal('');

  errorMessage = signal('');

  // Signal to track if someone is logged in
  isLoggedIn = signal(!!localStorage.getItem('personId'));

  constructor(private http: HttpClient, private router: Router) {}

  // PERSON LOGIN
  submitLogin(form: NgForm) {
    this.errorMessage.set('');

    if (!form.valid) {
      this.errorMessage.set('Please enter a valid document.');
      return;
    }

    this.http
      .post<{ ok: boolean; data?: any; message?: string }>(
        'http://localhost:3000/api/people/login',
        { document: this.document() }
      )
      .subscribe({
        next: (res) => {
          if (res.ok && res.data) {

            // Only store personId for persons — NO token
            localStorage.setItem("personId", res.data.person._id);

            this.router.navigate(['/people']);

          } else {
            this.errorMessage.set(res.message || 'Document not found.');
          }
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Server error');
        }
      });
  }

  // USER LOGIN
  submitUserLogin(form: NgForm) {
    this.errorMessage.set('');

    if (!form.valid) {
      this.errorMessage.set('Enter username and password.');
      return;
    }

    this.http
      .post<{ ok: boolean; data?: any; message?: string }>(
        'http://localhost:3000/api/users/login',
        {
          username: this.username(),
          password: this.password()
        }
      )
      .subscribe({
        next: (res) => {
          if (res.ok && res.data) {
            localStorage.setItem("token", res.data.token);

            this.isLoggedIn.set(true); // update login state
            this.router.navigate(['/people']);
          } else {
            this.errorMessage.set(res.message || 'Invalid login.');
          }
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Server error');
        }
      });
  }
  
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("personId");
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
