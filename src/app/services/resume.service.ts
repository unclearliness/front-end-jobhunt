import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../shared/constants/api-endpoints';

export interface CreateResumeRequest {
  email: string;
  url: string;
  userId: number;
  jobId: number;
}
export interface UpdateResumeRequest {
  id: number;
  status: string,
}

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private readonly http = inject(HttpClient);

  create(body: CreateResumeRequest): Observable<unknown> {
    return this.http.post(API_ENDPOINTS.resumes.create, body);
  }
  update(body: UpdateResumeRequest): Observable<unknown> {
    return this.http.put(API_ENDPOINTS.resumes.update, body);
  }
  getByHr(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(API_ENDPOINTS.resumes.byHr, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }

}
