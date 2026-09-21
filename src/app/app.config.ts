import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core'
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig
} from '@angular/router'
import { registerLocaleData } from '@angular/common'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import localeRu from '@angular/common/locales/ru'
import { catchError, of } from 'rxjs'
import { SpriteLoaderService } from './core/config/sprite-loader.service'
import { routes } from './app.routes'
import { authInterceptor } from './core/auth/auth.interceptor'
import { AuthService } from './core/auth/auth.service'

registerLocaleData(localeRu)

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withRouterConfig({
        paramsInheritanceStrategy: 'always'
      }),
      withComponentInputBinding()
    ),
    provideAppInitializer(() => {
      inject(SpriteLoaderService).loadSprite()
      inject(AuthService)
        .checkAuth()
        .pipe(catchError(() => of(null)))
    })
  ]
}
