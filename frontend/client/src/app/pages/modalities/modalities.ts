import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalitiesService } from '../../services/modalities.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-modalities',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './modalities.html',
  styleUrls: ['./modalities.css'],
})
export class Modalities {
  // Inject services using Angular's inject API.
  private modalitiesService = inject(ModalitiesService);
  private authService = inject(AuthService);

  protected modalities = signal([] as any[]);

  newModality: any = {
    code_meaning: '',
    code_value: '',
  };

  isAdmin = false;

  ngOnInit() {
    // Load initial list and compute role-based UI permissions.
    this.loadModalities();
    this.isAdmin = this.authService.getCurrentRoleFromToken() === 1;
  }

  private loadModalities() {
    // Retrieves modalities and stores them in a reactive signal.
    this.modalitiesService.getAll().subscribe({
      next: (res) => {
        this.modalities.set(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  createModality() {
    // Creates a modality and updates local list optimistically.
    this.modalitiesService.create(this.newModality).subscribe({
      next: (res) => {
        this.modalities.update((modalities) => [...modalities, res]);
        this.newModality = {
          code_meaning: '',
          code_value: '',
        };
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  deleteModality(id: string) {
    // Deletes a modality and removes it from local state.
    this.modalitiesService.delete(id).subscribe({
      next: (res) => {
        this.modalities.update((modalities) =>
          modalities.filter((modality) => modality._id !== id),
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
