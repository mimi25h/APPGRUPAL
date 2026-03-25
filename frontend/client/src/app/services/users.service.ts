import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { API_BASE_URL } from '../core/config/api.config';

// Client-side user model for API responses.
interface User {
  _id: string;
  fk_person: string;
  username: string;
  email: string;
  role: 1 | 2; // 1: admin 2: viewer
  settings?: {
    language?: string;
    theme?: string;
  };
  status: boolean;
}

interface CreateUser extends Omit<User, '_id' | 'status'> {
  password: string;
  status?: boolean;
}

type UpdateUser = Partial<CreateUser>;

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // Base resource endpoint for users module.
  private http = inject(HttpClient);
  private api = `${API_BASE_URL}/api/users`;

  getAll() {
    // Backend wraps payload in { data }, so map to raw array.
    return this.http.get<{ data: User[] }>(this.api).pipe(map((res) => res.data));
  }

  getOne(id: string) {
    return this.http.get<{ data: User }>(`${this.api}/${id}`).pipe(map((res) => res.data));
  }

  create(user: CreateUser) {
    return this.http.post<{ data: User }>(this.api, user).pipe(map((res) => res.data));
  }

  update(id: string, user: UpdateUser) {
    return this.http.put<{ data: User }>(`${this.api}/${id}`, user).pipe(map((res) => res.data));
  }

  delete(id: string) {
    return this.http.delete<{ data: User }>(`${this.api}/${id}`).pipe(map((res) => res.data));
  }
}
