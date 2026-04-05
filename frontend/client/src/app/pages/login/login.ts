import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule, NgIf],
})
export class Login {
  username = '';
  password = '';
  isLoggedIn = false;

  private _snackBar = inject(MatSnackBar);

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    console.log('✅ Componente Login cargado');
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  submitLogin(form: NgForm) {
    console.log('📝 submitLogin ejecutado', form.valid);
    if (!form.valid) {
      console.log('❌ Formulario inválido');
      this.openSnackBar('Ingresa usuario y contraseña.', 'Cerrar', 'error');
      return;
    }

    this.authService
      .loginUser({
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          if (res.ok && res.data) {
            this.isLoggedIn = true;
            const role = this.authService.getCurrentRoleFromToken();

            this.openSnackBar('¡Sesión iniciada correctamente!', 'Cerrar', 'success');

            if (role === 1) {
              this.router.navigate(['/people']);
              return;
            }

            if (role === 2) {
              this.router.navigate(['/modalities']);
              return;
            }

            this.openSnackBar('Rol no permitido.', 'Cerrar', 'error');
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            const errorMsg = res.message || 'Credenciales inválidas.';
            this.openSnackBar(errorMsg, 'Cerrar', 'error');
          }
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Error del servidor';
          this.openSnackBar(errorMsg, 'Cerrar', 'error');
        },
      });
  }

  openSnackBar(message: string, action: string, type: 'success' | 'error' = 'error') {
    console.log('Abriendo snackbar:', message, type);
    this._snackBar.open(message, action, {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${type}`],
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.openSnackBar('Sesión cerrada.', 'Cerrar', 'success');
    this.router.navigate(['/login']);
  }
}
