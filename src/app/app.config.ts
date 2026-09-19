import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideZoneChangeDetection
} from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from './app-routing.module'
import { registerLocaleData } from '@angular/common'
import localeRu from '@angular/common/locales/ru'

registerLocaleData(localeRu)
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig
} from '@angular/router'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
    provideRouter(
      routes,
      withRouterConfig({
        paramsInheritanceStrategy: 'always'
      }),
      withComponentInputBinding()
    ),
  ]
}
