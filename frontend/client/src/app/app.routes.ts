import { Routes } from '@angular/router';
import { People } from './pages/people/people';
import { Login } from './pages/login/login';
import { Landing } from './pages/landing/landing';
import { Users } from './pages/users/users';
import { Modalities } from './pages/modalities/modalities';
import { AuthGuard } from './core/guards/auth-guard';
import { AdminGuard } from './core/guards/admin.guard';
import { Organizations } from './pages/organizations/organizations';
import { PeopleEdit } from './pages/people/edit/edit';
import { OrganizationsEdit } from './pages/organizations/edit/edit';
import { UsersEdit } from './pages/users/edit/edit';
import { ModalitiesEdit } from './pages/modalities/edit/edit';

// Application route table.
// Separates public routes, admin-only routes, and authenticated routes.
export const routes: Routes = [
  // Public routes
  { path: '', component: Landing },
  { path: 'login', component: Login },

  // Admin-only routes (protected by role-based guard)
  { path: 'people', component: People, canActivate: [AdminGuard] },
  { path: 'people/:id/edit', component: PeopleEdit, canActivate: [AdminGuard] },

  { path: 'users', component: Users, canActivate: [AdminGuard] },
  { path: 'users/:id/edit', component: UsersEdit, canActivate: [AdminGuard] },

  { path: 'organizations', component: Organizations, canActivate: [AdminGuard] },
  { path: 'organizations/:id/edit', component: OrganizationsEdit, canActivate: [AdminGuard] },

  { path: 'modalities/:id/edit', component: ModalitiesEdit, canActivate: [AdminGuard] },

  // Authenticated route (admin or viewer)
  { path: 'modalities', component: Modalities, canActivate: [AuthGuard] },
];
