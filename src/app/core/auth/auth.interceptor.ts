import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { AuthService } from './auth.service'
import { AUTH_REQUIRED } from '../config/tokens'
import { catchError, throwError } from 'rxjs'
import { AuthError } from './auth.errors'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)

  const requiresAuth = req.context.get(AUTH_REQUIRED)
  if (requiresAuth) {
    const token = authService.authToken()
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
      return next(cloned)
    }
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (
        requiresAuth &&
        err.status === 401 &&
        err.error.message === 'AUTH_INVALID_TOKEN'
      ) {
        authService.logout()
        return throwError(() => new AuthError('invalid_token'))
      }
      return throwError(() => err)
    })
  )
}
