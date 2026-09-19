import { HttpContextToken } from '@angular/common/http'
import { InjectionToken } from '@angular/core'

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: (): string => 'https://797abe465cf8593e.mokky.dev'
})

export const AUTH_TOKEN_COOKIE = new InjectionToken<string>(
  'AUTH_TOKEN_COOKIE',
  {
    providedIn: 'root',
    factory: (): string => 'auth_token'
  }
)

export const AUTH_REQUIRED = new HttpContextToken<boolean>(() => false)
