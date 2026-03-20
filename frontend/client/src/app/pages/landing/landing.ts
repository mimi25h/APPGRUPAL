import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="landing-container">
      <h1>Welcome to APPGRUPAL</h1>
      <p>Please log in to continue.</p>
      <a routerLink="/login"><button>Go to Login</button></a>
    </div>
  `,
  styleUrls: ['./landing.css']
})
export class Landing {}