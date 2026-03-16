import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

interface Person {
  _id: string;
  document: string;
  name_01: string;
  name_02?: string;
  surname_01: string;
  surname_02?: string;
  birth_date: string;
  gender?: number;
  phone_numbers: string[];
}

type CreatePerson = Omit<Person, '_id' | 'phone_numbers'> & { phone_numbers?: string[] };

type UpdatePerson = Partial<CreatePerson>;

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private http = inject(HttpClient);
  private api = 'http://localhost:3000/api/people';

  getAll() {
    return this.http.get<{ data: Person[] }>(this.api).pipe(map((res) => res.data));
  }

  getOne(id: string) {
    return this.http.get<{ data: Person }>(`${this.api}/${id}`).pipe(map((res) => res.data));
  }

  create(person: CreatePerson) {
    return this.http.post<{ data: Person }>(this.api, person).pipe(map((res) => res.data));
  }

  update(id: string, person: UpdatePerson) {
    return this.http
      .put<{ data: Person }>(`${this.api}/${id}`, person)
      .pipe(map((res) => res.data));
  }

  delete(id: string) {
    return this.http.delete<{ data: Person }>(`${this.api}/${id}`).pipe(map((res) => res.data));
  }
}
