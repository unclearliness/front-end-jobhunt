import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../shared/constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<any> {
    return this.http.get<any>(API_ENDPOINTS.skills);
  }

  searchPaginated(page = 1, size = 10, filter?: string): Observable<any> {
    const params: any = { page, size };
    if (filter) {
      params.filter = filter;
    }
    return this.http.get<any>(API_ENDPOINTS.skills, { params });
  }

  create(body: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.skills, body);
  }

  update(body: any): Observable<any> {
    return this.http.put<any>(API_ENDPOINTS.skills, body);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${API_ENDPOINTS.skills}/${id}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${API_ENDPOINTS.skills}/${id}`);
  }
}