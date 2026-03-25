import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrganizationsService } from '../../../services/organizations.service';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class OrganizationsEdit {
  private organizationsService = inject(OrganizationsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected organizationId = signal('');
  protected loading = signal(true);
  protected loadError = signal('');
  protected updateError = signal('');

  organization: any = {
    name: '',
    short_name: '',
    country_code: '',
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loadError.set('No se encontro el id de la organizacion.');
      this.loading.set(false);
      return;
    }

    this.organizationId.set(id);
    this.loadOrganization(id);
  }

  private loadOrganization(id: string) {
    this.organizationsService.getOne(id).subscribe({
      next: (res) => {
        this.organization = {
          name: res.name || '',
          short_name: res.short_name || '',
          country_code: res.country_code || '',
        };
        this.loading.set(false);
      },
      error: (err) => {
        const backendMessage = err?.error?.message;
        this.loadError.set(backendMessage || 'No se pudo cargar la organizacion.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  updateOrganization(form: NgForm) {
    if (form.invalid || !this.organizationId()) {
      return;
    }

    this.updateError.set('');
    this.organizationsService.update(this.organizationId(), this.organization).subscribe({
      next: () => {
        this.router.navigate(['/organizations']);
      },
      error: (err) => {
        const backendMessage = err?.error?.message;
        this.updateError.set(
          backendMessage || 'No se pudo actualizar la organizacion. Revisa los campos.',
        );
        console.error(err);
      },
    });
  }
}
