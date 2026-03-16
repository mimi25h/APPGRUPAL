import { Routes } from '@angular/router';
import { People } from './pages/people/people';
import { PersonLogin } from './pages/login/login';
import { Landing } from './pages/landing/landing';
import { Users } from './users/users';

export const routes: Routes = [

  { path: '', component: Landing },   // homepage

  { path: 'login', component: PersonLogin },

  { path: 'people', component: People },

  { path: 'users', component: Users }

];