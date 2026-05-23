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

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private readonly http = inject(HttpClient);

  create(body: CreateResumeRequest): Observable<unknown> {
    return this.http.post(API_ENDPOINTS.resumes.create, body);
  }
}
