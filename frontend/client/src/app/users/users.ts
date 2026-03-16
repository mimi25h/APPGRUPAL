import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  role = 2;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.fk_person = payload.id; // auto-fill your own ID
      } catch {
        this.router.navigate(['/login']);
      }
    }
  }

  createUser(form: NgForm) {
    if (!form.valid) return;

    const token = localStorage.getItem("token");

    // If fk_person is empty, use your own ID from JWT
    let fk = this.fk_person;
    if (!fk) {
      try {
        const payload = JSON.parse(atob(token!.split('.')[1]));
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
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: res => console.log(res),
      error: err => console.error(err)
    });
  }
}