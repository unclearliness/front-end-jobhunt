import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable, Unsubscribable } from 'rxjs';
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
  resumeStatus: string;
}

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly http = inject(HttpClient);

  create(body: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.jobs.create, body);
  }

  search(page = 1, size = 4, sort?: string): Observable<JobApi[]> {


    return this.http
      .get<any>(API_ENDPOINTS.jobs.search, {
        params: { page, size, ...(sort ? { sort } : {}) },
      })
      .pipe(map((res) => (res?.data?.result ?? res?.data ?? []) as JobApi[]));
  }

  searchPaginated(page = 1, size = 4, filter?: string): Observable<any> {
    const params: any = { page, size };
    if (filter) {
      params.filter = filter;
    }
    return this.http.get<any>(API_ENDPOINTS.jobs.search, {
      params,
    });
  }

  getById(id: number): Observable<JobApi> {
    return this.http.get<any>(API_ENDPOINTS.jobs.detail(id)).pipe(
      map((res) => (res?.data ?? res) as JobApi),
    );
  }
  getApplicationsByResume(): Observable<JobApi[]> {
    return this.http.get<any>(API_ENDPOINTS.jobs.byResume).pipe(
      map(res => res?.data || [])
    );
  }

  getByCompany(companyId: number, page = 1, size = 10, filter?: string): Observable<any> {
    const params: any = { page, size };
    if (filter) {
      params.filter = filter;
    }
    return this.http.get<any>(API_ENDPOINTS.jobs.byCompany(companyId), {
      params,
    });
  }

  getByHr(page = 1, size = 10, filter?: string): Observable<any> {
    const params: any = { page, size };
    if (filter) {
      params.filter = filter;
    }
    return this.http.get<any>(API_ENDPOINTS.jobs.byHr, {
      params,
    });
  }

  update(body: any): Observable<any> {
    return this.http.put<any>(API_ENDPOINTS.jobs.update, body);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(API_ENDPOINTS.jobs.delete(id));
  }

  saveJob(jobId: number): Observable<void> {
    return this.http.post<void>(`${API_ENDPOINTS.jobs.search}/${jobId}/save`, {});
  }

  unsaveJob(jobId: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.jobs.search}/${jobId}/save`);
  }

  getSavedJobs(): Observable<JobApi[]> {
    return this.http
      .get<any>(`${API_ENDPOINTS.jobs.search}/saved`)
      .pipe(map((res) => (res?.data ?? res) as JobApi[]));
  }
}
