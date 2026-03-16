import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleService } from '../../services/people.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './people.html',
  styleUrls: ['./people.css'],
})
export class People implements OnInit {
  people: any[] = [];

  newPerson: any = {
    document: '',
    name_01: '',
    surname_01: '',
    birth_date: '',
    phone_numbers: '',
  };

  isAdmin = false; // Only true if a user token exists

  constructor(
    private peopleService: PeopleService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.detectRole();
    this.loadPeople();
  }

  // Check if a user is logged in and is admin
  detectRole() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.isAdmin = false;
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.isAdmin = payload.role === 1; // Only users with role=1 are admins
    } catch {
      this.isAdmin = false;
    }
  }

  loadPeople() {
    this.peopleService.getAll().subscribe({
      next: (res) => {
        this.people = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  createPerson() {
    if (!this.isAdmin) return;

    const payload = {
      ...this.newPerson,
      phone_numbers: this.newPerson.phone_numbers
        ? this.newPerson.phone_numbers.split(',').map((p: string) => p.trim())
        : [],
    };

    this.peopleService.create(payload).subscribe({
      next: () => {
        this.newPerson = {
          document: '',
          name_01: '',
          surname_01: '',
          birth_date: '',
          phone_numbers: '',
        };
        this.loadPeople();
      },
      error: (err) => {
        console.log('BACKEND ERROR:', err.error);
      },
    });
  }

  deletePerson(id: string) {
    if (!this.isAdmin) return;

    this.peopleService.delete(id).subscribe({
      next: () => {
        this.people = this.people.filter((p) => p._id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Delete failed:', err);
      },
    });
  }

  // Logout only clears token for users
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('personId');
    this.router.navigate(['/login']);
  }

  // Navigate to Users page (admins only)
  goToUsers() {
    if (this.isAdmin) {
      this.router.navigate(['/users']);
    }
  }
}
