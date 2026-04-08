import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PeopleService } from '../../services/people.service';
import type { DeletePersonResponse } from '../../services/people.service';
import { AuthService } from '../../core/auth/auth.service';
import { ListOfPeople } from './list-of-people/list-of-people/list-of-people';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule, FormsModule, ListOfPeople],
  templateUrl: './people.html',
  styleUrls: ['./people.css'],
})
export class People implements OnInit {
  // In-memory list rendered by the template.
  people: any[] = [];

  newPerson: any = {
    document: '',
    name_01: '',
    surname_01: '',
    birth_date: '',
    phone_numbers: '',
  };

  isAdmin = false;
  showList = false;
  showForm = true;

  constructor(
    private peopleService: PeopleService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Always start with form visible and list hidden on page load.
    this.showList = false;
    this.showForm = true;

    // Guard route manually in case component is reached without a valid session.
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.detectRole();
    this.loadPeople();
  }

  detectRole() {
    // Resolve current role to enable/disable admin actions in UI.
    const role = this.authService.getCurrentRoleFromToken();
    this.isAdmin = role === 1;
  }

  loadPeople() {
    // Fetches people list and forces view refresh after async update.
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
    // Block non-admin users from creating records.
    if (!this.isAdmin) return;

    // Backend expects phone numbers as array, split from comma-separated input.
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
        this.showList = true;
        this.showForm = false;
        this.loadPeople();
      },
      error: (err) => {
        console.log('BACKEND ERROR:', err.error);
      },
    });
  }

  showPeopleList() {
    this.showList = true;
    this.showForm = false;
    if (!this.people.length) {
      this.loadPeople();
    }
  }

  hidePeopleList() {
    this.showList = false;
    this.showForm = true;
  }

  deletePerson(id: string) {
    // Block non-admin users from deleting records.
    if (!this.isAdmin) return;

    this.peopleService.delete(id).subscribe({
      next: (res: DeletePersonResponse) => {
        this.people = this.people.filter((p) => p._id !== id);
        this.cdr.detectChanges();

        // If current session user was deleted, force logout.
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
