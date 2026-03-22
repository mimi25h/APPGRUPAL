import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_BASE_URL } from '../core/config/api.config';

// Client-side person model for API responses.
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

export interface DeletePersonResponse {
  message: string;
  logout: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  // Base resource endpoint for people module.
  private http = inject(HttpClient);
  private api = `${API_BASE_URL}/api/people`;

  getAll() {
    // Backend wraps payload in { data }, so map to raw array.
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
    // Delete returns a custom response with logout flag.
    return this.http.delete<DeletePersonResponse>(`${this.api}/${id}`);
  }
}
