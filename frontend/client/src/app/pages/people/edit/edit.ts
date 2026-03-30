import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PeopleService } from '../../../services/people.service';

@Component({
  selector: 'app-people-edit',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class PeopleEdit {
  private peopleService = inject(PeopleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected personId = signal('');
  protected loading = signal(true);
  protected loadError = signal('');
  protected updateError = signal('');

  person: any = {
    document: '',
    name_01: '',
    name_02: '',
    surname_01: '',
    surname_02: '',
    birth_date: '',
    gender: '',
    phone_numbers: '',
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loadError.set('No se encontro el id de la persona.');
      this.loading.set(false);
      return;
    }

    this.personId.set(id);
    this.loadPerson(id);
  }

  private loadPerson(id: string) {
    this.peopleService.getOne(id).subscribe({
      next: (res) => {
        this.person = {
          document: res.document || '',
          name_01: res.name_01 || '',
          name_02: res.name_02 || '',
          surname_01: res.surname_01 || '',
          surname_02: res.surname_02 || '',
          birth_date: res.birth_date || '',
          gender: res.gender ?? '',
          phone_numbers: Array.isArray(res.phone_numbers) ? res.phone_numbers.join(', ') : '',
        };
        this.loading.set(false);
      },
      error: (err) => {
        const backendMessage = err?.error?.message;
        this.loadError.set(backendMessage || 'No se pudo cargar la persona.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  updatePerson(form: NgForm) {
    if (form.invalid || !this.personId()) {
      return;
    }

    this.updateError.set('');

    const payload = {
      ...this.person,
      phone_numbers: this.person.phone_numbers
        ? this.person.phone_numbers
            .split(',')
            .map((p: string) => p.trim())
            .filter((p: string) => p.length > 0)
        : [],
    };

    this.peopleService.update(this.personId(), payload).subscribe({
      next: () => {
        this.router.navigate(['/people']);
      },
      error: (err) => {
        const backendMessage = err?.error?.message;
        this.updateError.set(
          backendMessage || 'No se pudo actualizar la persona. Revisa los campos.',
        );
        console.error(err);
      },
    });
  }
}
