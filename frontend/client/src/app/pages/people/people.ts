import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleService } from '../../services/people.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './people.html',
  styleUrls: ['./people.css']
})
export class People implements OnInit {

  people: any[] = [];

  constructor(
    private peopleService: PeopleService,
    private cdr: ChangeDetectorRef
  ) {}

  newPerson:any = {
  document: '',
  name_01: '',
  surname_01: '',
  birth_date: ''
};

  ngOnInit() {
    this.peopleService.getAll().subscribe((data:any) => {
      this.people = data.data || data;

      // force Angular to update the DOM
      this.cdr.detectChanges();
    });
  }

createPerson() {

  const payload = {
    ...this.newPerson,
    phone_numbers: this.newPerson.phone_numbers
      ? this.newPerson.phone_numbers.split(',').map((p:string) => p.trim())
      : []
  };

  this.peopleService.create(payload).subscribe({
    next: (res:any) => {
      const created = res.data || payload;
      this.people.push(created);
    },

    error: (err) => {
      console.log("BACKEND ERROR:", err.error);
    }
  });

}

  deletePerson(id: string) {
    this.peopleService.delete(id).subscribe(() => {
      this.people = this.people.filter(p => p._id !== id);
      this.cdr.detectChanges();
    });
  }
}


