import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../shared/constants/api-endpoints';

interface JobCompanyApi {
  id: number;
  name: string;
  description: string;
  address: string;
  logo: string | null;
  industry: string;
  companySize: number;
  founded: number;
}

export interface JobApi {
  id: number;
  name: string;
  location: string;
  salary: number;
  quantity: number;
  level: string;
  description: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  company: JobCompanyApi;
  skill: unknown[];
}

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly http = inject(HttpClient);

  search(page = 1, size = 4): Observable<JobApi[]> {
    return this.http
      .get<any>(API_ENDPOINTS.jobs.search, {
        params: { page, size },
      })
      .pipe(map((res) => (res?.data?.result ?? res?.data ?? []) as JobApi[]));
  }

  getById(id: number): Observable<JobApi> {
    return this.http.get<any>(API_ENDPOINTS.jobs.detail(id)).pipe(
      map((res) => (res?.data ?? res) as JobApi),
    );
  }
}
