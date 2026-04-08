import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-of-users',
  imports: [CommonModule, RouterLink],
  templateUrl: './list-of-users.html',
  styleUrl: './list-of-users.css',
})
export class ListOfUsers {
  @Input() users: any[] = [];
  @Input() isAdmin = false;
}
