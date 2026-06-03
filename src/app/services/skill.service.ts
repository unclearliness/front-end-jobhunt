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
}