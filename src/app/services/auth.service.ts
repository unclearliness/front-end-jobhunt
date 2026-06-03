import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, map, of } from 'rxjs';
import { API_ENDPOINTS } from '../shared/constants/api-endpoints';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  address: string;
}

export interface LoginResponse {
  statusCode: number;
  error: string | null;
  message: string;
  data: LoginData;
}
export interface LoginData {
  accessToken: string;
  refreshToken: string;
}

export interface AccountResponse {
  id: number;
  name: string;
  email: string;
  logo?: string;
  role: {
    id: number;
    name: string;
  };
  company?: any;
}

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly userLogo = signal<string | null>(null);
  private accountInfo: AccountResponse | null = null;

  login(body: LoginRequest): Observable<LoginResponse> {
    this.accountInfo = null; // Clear cache on new login
    return this.http.post<LoginResponse>(API_ENDPOINTS.auth.login, body, {
      withCredentials: true,
    }).pipe(
      tap((response) => {
        this.setTokens(response);
      }),
    );
  }

  register(body: RegisterRequest): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.auth.register, body);
  }

  registerHr(body: RegisterRequest): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.auth.registerHr, body);
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(API_ENDPOINTS.auth.refresh, {
      withCredentials: true,
    }).pipe(
      tap((response) => {
        this.setTokens(response);
      })
    );
  }

  getAccount(forceRefresh = false): Observable<AccountResponse> {
    if (this.accountInfo && !forceRefresh) {
      return of(this.accountInfo);
    }
    return this.http.get<{ data: AccountResponse }>(API_ENDPOINTS.auth.account).pipe(
      map((res) => res.data),
      tap((res) => {
        this.accountInfo = res;
        if (res.logo) {
          this.userLogo.set(res.logo);
        } else {
          this.userLogo.set(null);
        }
      })
    );
  }

  logout(): void {
    this.accountInfo = null; // Clear cache on logout
    if (this.canUseStorage()) {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  private setTokens(response: LoginResponse): void {
    if (!this.canUseStorage()) {
      return;
    }
    window.localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
  }

  private canUseStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
