import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-of-people',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-of-people.html',
  styleUrls: ['./list-of-people.css'],
})
export class ListOfPeople {
  @Input() people: any[] = [];
  @Input() isAdmin = false;
  @Output() delete = new EventEmitter<string>();
}
