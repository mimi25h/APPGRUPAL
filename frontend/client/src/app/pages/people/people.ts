import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './people.html',
  styleUrls: ['./people.css']
})
export class People implements OnInit {

  people: any[] = [];

  constructor(private peopleService: PeopleService) {}

  ngOnInit() {
    this.peopleService.getAll().subscribe((data:any) => {
      this.people = data.data || data;
    });
  }

  deletePerson(id: string) {
    this.peopleService.delete(id).subscribe(() => {
      this.people = this.people.filter(p => p._id !== id);
    });
  }

}