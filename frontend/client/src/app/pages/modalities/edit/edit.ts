import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ModalitiesService } from '../../../services/modalities.service';

@Component({
  selector: 'app-modalities-edit',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class ModalitiesEdit {
  private modalitiesService = inject(ModalitiesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected modalityId = signal('');
  protected loading = signal(true);
  protected loadError = signal('');
  protected updateError = signal('');

  modality: any = {
    code_meaning: '',
    code_value: '',
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loadError.set('No se encontro el id de la modalidad.');
      this.loading.set(false);
      return;
    }

    this.modalityId.set(id);
    this.loadModality(id);
  }

  private loadModality(id: string) {
    this.modalitiesService.getOne(id).subscribe({
      next: (res) => {
        this.modality = {
          code_meaning: res.code_meaning || '',
          code_value: res.code_value || '',
        };
        this.loading.set(false);
      },
      error: (err) => {
        const backendMessage = err?.error?.message;
        this.loadError.set(backendMessage || 'No se pudo cargar la modalidad.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  updateModality(form: NgForm) {
    if (form.invalid || !this.modalityId()) {
      return;
    }

    this.updateError.set('');
    this.modalitiesService.update(this.modalityId(), this.modality).subscribe({
      next: () => {
        this.router.navigate(['/modalities']);
      },
      error: (err) => {
        const backendMessage = err?.error?.message;
        this.updateError.set(
          backendMessage || 'No se pudo actualizar la modalidad. Revisa los campos.',
        );
        console.error(err);
      },
    });
  }
}
