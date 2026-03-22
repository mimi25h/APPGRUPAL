import { Component, inject, signal } from '@angular/core';
import { OrganizationsService } from '../../services/organizations.service';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-organizations',
  imports: [CommonModule, FormsModule],
  templateUrl: './organizations.html',
  styleUrl: './organizations.css',
})
export class Organizations {
  private organizationsService = inject(OrganizationsService);
  private authService = inject(AuthService);

  protected organizations = signal([] as any[]);
  protected createError = signal('');

  newOrganization: any = {
    name: '',
    short_name: '',
    country_code: '',
  };

  ngOnInit() {
    this.loadOrganizations();
  }

  private loadOrganizations() {
    this.organizationsService.getAll().subscribe({
      next: (res) => {
        this.organizations.set(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  createOrganization(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.createError.set('');
    this.organizationsService.create(this.newOrganization).subscribe({
      next: (res) => {
        this.organizations.update((organizations) => [...organizations, res]);
        this.newOrganization = {
          name: '',
          short_name: '',
          country_code: '',
        };
        form.resetForm(this.newOrganization);
      },
      error: (err) => {
        const backendMessage = err?.error?.errors?.[0]?.msg;
        this.createError.set(
          backendMessage || 'No se pudo crear la organizacion. Revisa los campos.',
        );
        console.error(err);
      },
    });
  }

  deleteOrganization(id: string) {
    this.organizationsService.delete(id).subscribe({
      next: (res) => {
        this.organizations.update((organizations) =>
          organizations.filter((organization) => organization._id !== id),
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
