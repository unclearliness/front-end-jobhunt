import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../shared/constants/api-endpoints';

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: string;
    address: string;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private readonly http = inject(HttpClient);

    getUserProfile(id: number): Observable<UserProfile> {
        return this.http.get<{ data: UserProfile }>(API_ENDPOINTS.users.detail(id))
            .pipe(map((res) => res.data));
    }
    updateUserProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
        return this.http.put<{ data: UserProfile }>(API_ENDPOINTS.users.update, profile)
            .pipe(map((res) => res.data));
    }



}
