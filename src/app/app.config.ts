import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { registerLocaleData } from '@angular/common'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig
} from '@angular/router'
import localeRu from '@angular/common/locales/ru'
import { authInterceptor } from './core/auth/auth.interceptor'
import { routes } from './app.routes'

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
