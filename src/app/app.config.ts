import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { registerLocaleData } from '@angular/common'
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig
} from '@angular/router'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { routes } from './app.routes'
import { authInterceptor } from './core/auth/auth.interceptor'
import localeRu from '@angular/common/locales/ru'

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
    )
  ]
}
