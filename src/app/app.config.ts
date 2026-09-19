import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig
} from '@angular/router'
import { registerLocaleData } from '@angular/common'
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
