import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { API_BASE_URL } from '../core/config/api.config';

// Client-side modality model for API responses.
interface Modality {
  _id: string;
  code_meaning: string;
  code_value: string;
  status: boolean;
}

type CreateModality = Omit<Modality, '_id' | 'status'> & { status?: boolean };

type UpdateModality = Partial<CreateModality>;

@Injectable({
  providedIn: 'root',
})
export class ModalitiesService {
  // Base resource endpoint for modalities module.
  private http = inject(HttpClient);
  private api = `${API_BASE_URL}/api/modalities`;

  getAll() {
    // Backend wraps payload in { data }, so map to raw array.
    return this.http.get<{ data: Modality[] }>(this.api).pipe(map((res) => res.data));
  }

  getOne(id: string) {
    return this.http.get<{ data: Modality }>(`${this.api}/${id}`).pipe(map((res) => res.data));
  }

  create(modality: CreateModality) {
    return this.http.post<{ data: Modality }>(this.api, modality).pipe(map((res) => res.data));
  }

  update(id: string, modality: UpdateModality) {
    return this.http
      .put<{ data: Modality }>(`${this.api}/${id}`, modality)
      .pipe(map((res) => res.data));
  }

  delete(id: string) {
    return this.http.delete<{ data: Modality }>(`${this.api}/${id}`).pipe(map((res) => res.data));
  }
}
