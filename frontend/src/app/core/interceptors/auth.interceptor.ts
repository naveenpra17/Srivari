import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const AUTH_RETRY_HEADER = 'X-Auth-Retry';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  const isPublicApi =
    req.url.includes('/public/') ||
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/refresh');
  const isRetry = req.headers.has(AUTH_RETRY_HEADER);

  const headers: Record<string, string> = { 'ngsw-bypass': 'true' };
  if (token && !isPublicApi) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  req = req.clone({ setHeaders: headers });

  const shouldRefresh = (status: number) =>
    (status === 401 || status === 403) && auth.getRefreshToken() && !isRetry && !isPublicApi;

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (shouldRefresh(error.status)) {
        return auth.refreshToken().pipe(
          switchMap(() => {
            const newToken = auth.getToken();
            const retryReq = req.clone({
              setHeaders: {
                'ngsw-bypass': 'true',
                Authorization: `Bearer ${newToken}`,
                [AUTH_RETRY_HEADER]: 'true'
              }
            });
            return next(retryReq);
          }),
          catchError(() => {
            auth.logout();
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
