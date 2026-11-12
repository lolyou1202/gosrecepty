import { Injectable, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { map } from 'rxjs'
import { BreakpointObserver } from '@angular/cdk/layout'
import { MOBILE_BREAKPOINT } from '@core/config/constants'

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly _breakpointObserver = inject(BreakpointObserver)
  private readonly _query = `(max-width: ${MOBILE_BREAKPOINT}px)`

  public readonly isMobile$ = this._breakpointObserver
    .observe(this._query)
    .pipe(map(result => result.matches))

  public readonly isMobile = toSignal(this.isMobile$, { initialValue: false })
}
