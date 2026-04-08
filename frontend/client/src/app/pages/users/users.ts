import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UsersService } from '../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users {
  // Form model for creating a user linked to an existing person.
  fk_person = '';
  username = '';
  email = '';
  password = '';
  role: 1 | 2 = 2;
  token = '';
  currentRole: 1 | 2 | null = null;
  private _snackBar = inject(MatSnackBar);

  constructor(
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  ngOnInit() {
    // Resolve session context and enforce admin-only access for this page.
    this.token = this.authService.getToken() ?? '';
    this.currentRole = this.authService.getCurrentRoleFromToken();

    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.currentRole !== 1) {
      this.router.navigate(['/login']);
    }
  }

  createUser(form: NgForm) {
    // Only valid form submissions from admin users are allowed.
    if (!form.valid || this.currentRole !== 1) {
      return;
    }

    const fk = this.fk_person.trim();
    if (!fk) {
      alert('Person ID is required to create a user.');
      return;
    }

    // Sends create request and clears form model on success.
    this.usersService
      .create({
        fk_person: fk,
        username: this.username,
        email: this.email,
        password: this.password,
        role: this.role,
      })
      .subscribe({
        next: () => {
          this.username = '';
          this.email = '';
          this.password = '';
          this.role = 2;
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('Error al crear usuario.', 'Cerrar', 'error');
        },
        complete: () => {
          this.openSnackBar('Usuario creado exitosamente.', 'Cerrar', 'exitoso');
        },
      });
  }

  goToPeople() {
    // Convenience navigation back to people management.
    this.router.navigate(['/people']);
  }
  openSnackBar(message: string, action: string, type: 'exitoso' | 'error' = 'error') {
    console.log('Abriendo snackbar:', message, type);
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
