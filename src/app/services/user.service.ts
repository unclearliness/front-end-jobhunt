import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../shared/constants/api-endpoints';

export interface UserProfile {
    id: number;
    logo?: string;
    name: string;
    email: string;
    age: number;
    gender: string;
    address: string;
    role: {
        id: number;
        name: string;
    };
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
    createUser(user: any): Observable<any> {
        return this.http.post<any>(API_ENDPOINTS.users.create, user);
    }
    getUsers(page = 1, size = 10, filter?: string): Observable<any> {
        const params: any = { page, size };
        if (filter) {
            params.filter = filter;
        }
        return this.http.get<any>(API_ENDPOINTS.users.search, { params });
    }
    deleteUser(id: number): Observable<any> {
        return this.http.delete<any>(API_ENDPOINTS.users.delete(id));
    }
}
