import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PeopleService } from '../../services/people.service';
import type { DeletePersonResponse } from '../../services/people.service';
import { AuthService } from '../../core/auth/auth.service';

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

  isAdmin = false;

  constructor(
    private peopleService: PeopleService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.detectRole();
    this.loadPeople();
  }

  detectRole() {
    const role = this.authService.getCurrentRoleFromToken();
    this.isAdmin = role === 1;
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
      next: (res: DeletePersonResponse) => {
        this.people = this.people.filter((p) => p._id !== id);
        this.cdr.detectChanges();

        if (res.logout) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('Delete failed:', err);
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
