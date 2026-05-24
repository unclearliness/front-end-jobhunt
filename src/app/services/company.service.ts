import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../shared/constants/api-endpoints';

export interface CompanyApi {
  id: number;
  name: string;
  description: string;
  address: string;
  logo: string | null;
  industry: string;
  companySize: number;
  founded: number;
}

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly http = inject(HttpClient);

  search(page = 1, size = 4): Observable<CompanyApi[]> {
    return this.http
      .get<any>(API_ENDPOINTS.companies.search, {
        params: { page, size },
      })
      .pipe(map((res) => res.data.result));
  }

  searchPaginated(page = 1, size = 4, filter?: string): Observable<any> {
    const params: any = { page, size };
    if (filter) {
      params.filter = filter;
    }
    return this.http.get<any>(API_ENDPOINTS.companies.search, {
      params,
    });
  }

  getById(id: number): Observable<CompanyApi> {
    return this.http
      .get<{ data: CompanyApi }>(API_ENDPOINTS.companies.detail(id))
      .pipe(map((res) => res.data));
  }
}
