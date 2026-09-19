import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { map, catchError, of } from 'rxjs'
import { AuthService } from './auth.service'

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isAuth()) {
    return true
  }

  return authService.checkAuth().pipe(
    map(user => {
      if (user) {
        return true
      }
      return router.createUrlTree(['/login'], {
        queryParams: { rUrl: state.url }
      })
    }),
    catchError(() => {
      return of(
        router.createUrlTree(['/login'], {
          queryParams: { rUrl: state.url }
        })
      )
    })
  )
}
