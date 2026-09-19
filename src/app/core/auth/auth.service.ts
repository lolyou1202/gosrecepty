import { Injectable, signal, computed, inject } from '@angular/core'
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse
} from '@angular/common/http'
import { Observable, tap, catchError, throwError, map, of } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import { AuthResponse, User } from './auth.model'
import {
  API_BASE_URL,
  AUTH_REQUIRED,
  AUTH_TOKEN_COOKIE
} from '../config/tokens'
import { AuthError } from './auth.errors'
import { Router } from '@angular/router'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _http = inject(HttpClient)
  private readonly _router = inject(Router)
  private readonly _cookie = inject(CookieService)
  private readonly _apiBaseUrl = inject(API_BASE_URL)
  private readonly _authTokenCookie = inject(AUTH_TOKEN_COOKIE)

  private readonly _user = signal<User | null>(null)
  private readonly _authToken = signal<string | null>(
    this._getTokenFromCookie()
  )

  public readonly isAuth = computed(() => !!this._user())
  public readonly user = this._user.asReadonly()
  public readonly authToken = this._authToken.asReadonly()

  public register(data: {
    userName: string
    email: string
    password: string
  }): Observable<boolean> {
    return this._http
      .post<AuthResponse>(`${this._apiBaseUrl}/register`, data)
      .pipe(
        map(() => true),
        catchError((err: HttpErrorResponse) => {
          if (
            err.status === 401 &&
            err.error.message === 'RESOURCE_USER_ALREADY_EXISTS'
          ) {
            return throwError(() => new AuthError('user_exists'))
          }
          if (err.status === 403) {
            return throwError(() => new AuthError('server'))
          }
          return throwError(() => new AuthError('unknown_registration'))
        })
      )
  }

  public login(data: { email: string; password: string }): Observable<boolean> {
    return this._http.post<AuthResponse>(`${this._apiBaseUrl}/auth`, data).pipe(
      tap(res => this._setSession(res)),
      map(() => true),
      catchError((err: HttpErrorResponse) => {
        if (
          err.status === 401 &&
          err.error.message === 'RESOURCE_INVALID_LOGIN_OR_PASSWORD'
        ) {
          return throwError(() => new AuthError('invalid_credentials'))
        }
        if (err.status === 403) {
          return throwError(() => new AuthError('server'))
        }
        return throwError(() => new AuthError('unknown_login'))
      })
    )
  }

  public checkAuth(): Observable<User | null> {
    if (!this._authToken()) {
      return of(null)
    }

    return this._http
      .get<User>(`${this._apiBaseUrl}/auth_me`, {
        context: new HttpContext().set(AUTH_REQUIRED, true)
      })
      .pipe(
        tap(user => this._user.set(user)),
        catchError(() => {
          this._clearSession()
          return of(null)
        })
      )
  }

  public logout(rUrl?: string): Promise<boolean> {
    this._clearSession()
    return this._router.navigate(['/login'], {
      queryParams: rUrl ? { rUrl } : {}
    })
  }

  private _setSession(authResult: AuthResponse): void {
    this._cookie.set(this._authTokenCookie, authResult.token, {
      expires: 7, // дней
      secure: true, // только по HTTPS
      sameSite: 'Strict', // защита от CSRF
      path: '/'
    })
    this._authToken.set(authResult.token)
    this._user.set(authResult.data)
  }

  private _clearSession(): void {
    this._cookie.delete(this._authTokenCookie, '/')
    this._authToken.set(null)
    this._user.set(null)
  }

  private _getTokenFromCookie(): string | null {
    return this._cookie.get(this._authTokenCookie) || null
  }
}
