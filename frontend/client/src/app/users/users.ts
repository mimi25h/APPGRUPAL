import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

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
  role = 2;

  // safe initialization
  token: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      this.router.navigate(['/login']);
      return;
    }
    this.token = storedToken;

    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      this.fk_person = payload.id; // auto-fill your own ID
    } catch {
      this.router.navigate(['/login']);
    }
  }

  createUser(form: NgForm) {
    if (!form.valid) return;

    let fk = this.fk_person || '';
    if (!fk && this.token) {
      try {
        const payload = JSON.parse(atob(this.token.split('.')[1]));
        fk = payload.id;
      } catch {
        alert("Invalid token, cannot determine your ID");
        return;
      }
    }

    this.http.post(
      "http://localhost:3000/api/users",
      {
        fk_person: fk,
        username: this.username,
        email: this.email,
        password: this.password,
        role: this.role
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    ).subscribe({
      next: res => console.log(res),
      error: err => console.error(err)
    });
  }

  goToPeople() {
    this.router.navigate(['/people']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem("personId");
    this.router.navigate(['/login']);
  }
}