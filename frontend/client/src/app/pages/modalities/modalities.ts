import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalitiesService } from '../../services/modalities.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-modalities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modalities.html',
  styleUrls: ['./modalities.css'],
})
export class Modalities {
  private modalitiesService = inject(ModalitiesService);
  private authService = inject(AuthService);

  protected modalities = signal([] as any[]);

  newModality: any = {
    code_meaning: '',
    code_value: '',
  };

  isAdmin = false;

  ngOnInit() {
    this.loadModalities();
    this.isAdmin = this.authService.getCurrentRoleFromToken() === 1;
  }

  private loadModalities() {
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
