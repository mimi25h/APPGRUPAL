import { Routes } from '@angular/router';
import { People } from './pages/people/people';
import { Login } from './pages/login/login';
import { Landing } from './pages/landing/landing';
import { Users } from './users/users';

export const routes: Routes = [
  { path: '', component: Landing }, // homepage

  { path: 'login', component: Login },

  { path: 'people', component: People },

  { path: 'users', component: Users },
];
