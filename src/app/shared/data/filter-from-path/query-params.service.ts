import { Injectable, InjectionToken, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { toSignal } from '@angular/core/rxjs-interop'
import { readStringParam } from '../../../utils/functions/read-string-param'

export const QUERY_PARAMS_PREFIX = new InjectionToken<string>(
  'QUERY_PARAMS_PREFIX'
)

@Injectable()
export class QueryParamsService {
  private readonly _route = inject(ActivatedRoute)
  private readonly _router = inject(Router)
  private readonly _prefix =
    inject(QUERY_PARAMS_PREFIX, { optional: true }) ?? null

  private readonly _params = toSignal(this._route.queryParams, {
    initialValue: {}
  })

  public key(name: string): string {
    return this._prefix ? `${this._prefix}_${name}` : name
  }

  public read(name: string): string | null {
    return readStringParam(this.key(name), this._params())
  }

  public readNumber(name: string): number | undefined {
    const raw = this.read(name)
    if (raw == null || raw === '') return undefined
    const n = Number(raw)
    return Number.isFinite(n) ? n : undefined
  }

  public readArray(name: string, separator = ','): string[] {
    const raw = this.read(name)
    return raw ? raw.split(separator).filter(Boolean) : []
  }

  public readEnum<T extends string>(
    name: string,
    allowed: readonly T[]
  ): T | undefined {
    const raw = this.read(name)
    return raw && (allowed as readonly string[]).includes(raw)
      ? (raw as T)
      : undefined
  }

  public async patch(params: Record<string, string | null>): Promise<void> {
    const prefixed = Object.fromEntries(
      Object.entries(params).map(([k, v]) => [this.key(k), v])
    )
    await this._router.navigate([], {
      relativeTo: this._route,
      queryParams: prefixed,
      queryParamsHandling: 'merge',
      replaceUrl: true
    })
  }
}
