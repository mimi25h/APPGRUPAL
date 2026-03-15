import { Routes } from '@angular/router';
import { People } from './pages/people/people';

export const routes: Routes = [
  { path: '', redirectTo: 'people', pathMatch: 'full' },
  { path: 'people', component: People }
];