import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable } from 'rxjs';

const ACCESS_TOKEN_KEY = 'accessToken';
let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window === 'undefined') {
    return next(req);
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  let authReq = req;
  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const isAuthRequest = req.url.includes('/auth/login') ||
                        req.url.includes('/auth/refresh') ||
                        req.url.includes('/auth/register');

  if (accessToken && !req.headers.has('Authorization') && !isAuthRequest) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !authReq.url.includes('/auth/login')
      ) {
        if (authReq.url.includes('/auth/refresh')) {
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => error);
        }

        return handle401Error(authReq, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        const newAccessToken = response.data.accessToken;
        refreshTokenSubject.next(newAccessToken);

        return next(
          req.clone({
            setHeaders: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          })
        );
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout();
        router.navigate(['/login']);
        refreshTokenSubject.error(err);
        refreshTokenSubject = new BehaviorSubject<string | null>(null);
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap((token) => {
        return next(
          req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          })
        );
      })
    );
  }
}

