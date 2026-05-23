import { HttpInterceptorFn } from '@angular/common/http';

const ACCESS_TOKEN_KEY = 'accessToken';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window === 'undefined' || req.headers.has('Authorization')) {
    return next(req);
  }

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);

  if (!accessToken) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  );
};
