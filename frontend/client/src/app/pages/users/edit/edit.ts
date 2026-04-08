import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-users-edit',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class UsersEdit {
  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected userId = signal('');
  protected loading = signal(true);
  protected loadError = signal('');
  protected updateError = signal('');

  user: any = {
    fk_person: '',
    username: '',
    email: '',
    password: '',
    role: 2,
  };

  private original_fk_person = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loadError.set('No se encontro el id del usuario.');
      this.loading.set(false);
      return;
    }

    this.userId.set(id);
    this.loadUser(id);
  }

  private loadUser(id: string) {
    this.usersService.getOne(id).subscribe({
      next: (res) => {
        this.user = {
          fk_person: res.fk_person || '',
          username: res.username || '',
          email: res.email || '',
          password: '',
          role: res.role ?? 2,
        };
        this.original_fk_person = res.fk_person || '';
        this.loading.set(false);
      },
      error: (err) => {
        const backendMessage = err?.error?.message;
        this.loadError.set(backendMessage || 'No se pudo cargar el usuario.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  updateUser(form: NgForm) {
    if (form.invalid || !this.userId()) {
      return;
    }

    this.updateError.set('');

    const payload: any = {
      username: this.user.username,
      email: this.user.email,
      role: this.user.role,
    };

    // Only include fk_person if it changed
    if (this.user.fk_person?.trim() !== this.original_fk_person) {
      payload.fk_person = this.user.fk_person?.trim();
    }

    const password = this.user.password?.trim();
    if (password) {
      payload.password = password;
    }

    this.usersService.update(this.userId(), payload).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (err) => {
        const backendMessage = err?.error?.message;
        this.updateError.set(
          backendMessage || 'No se pudo actualizar el usuario. Revisa los campos.',
        );
        console.error(err);
      },
    });
  }
}
