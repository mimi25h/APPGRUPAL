import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { API_BASE_URL } from '../core/config/api.config';

// Client-side organization model for API responses.
interface Organization {
  _id: string;
  name: string;
  short_name?: string;
  country_code?: string;
  status: boolean;
}

type CreateOrganization = Omit<Organization, '_id' | 'status'> & { status?: boolean };

type UpdateOrganization = Partial<CreateOrganization>;

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  // Base resource endpoint for organizations module.
  private http = inject(HttpClient);
  private api = `${API_BASE_URL}/api/organizations`;

  getAll() {
    // Backend wraps payload in { data }, so map to raw array.
    return this.http.get<{ data: Organization[] }>(this.api).pipe(map((res) => res.data));
  }

  getOne(id: string) {
    return this.http.get<{ data: Organization }>(`${this.api}/${id}`).pipe(map((res) => res.data));
  }

  create(organization: CreateOrganization) {
    return this.http
      .post<{ data: Organization }>(this.api, organization)
      .pipe(map((res) => res.data));
  }

  update(id: string, organization: UpdateOrganization) {
    return this.http
      .put<{ data: Organization }>(`${this.api}/${id}`, organization)
      .pipe(map((res) => res.data));
  }

  delete(id: string) {
    return this.http
      .delete<{ data: Organization }>(`${this.api}/${id}`)
      .pipe(map((res) => res.data));
  }
}
