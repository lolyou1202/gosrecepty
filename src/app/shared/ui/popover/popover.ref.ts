import { OverlayRef } from '@angular/cdk/overlay'
import { Subject } from 'rxjs'
import { PopoverCloseEvent, PopoverCloseReason } from './popover.model'

export class PopoverRef<R = unknown> {
  private readonly _closed = new Subject<PopoverCloseEvent<R>>()
  public readonly afterClosed$ = this._closed.asObservable()
  private _closing = false

  constructor(
    private readonly _overlayRef: OverlayRef,
    private readonly _options: { animationDuration: number }
  ) {}

  public close(payload?: R, reason: PopoverCloseReason = 'programmatic'): void {
    if (this._closing) return
    this._closing = true

    const panel = this._overlayRef.overlayElement
    panel.classList.add('popover-panel--leaving')

    const finish = (): void => {
      this._overlayRef.detach()
      this._overlayRef.dispose()
      this._closed.next({ reason, payload })
      this._closed.complete()
    }

    if (this._options.animationDuration > 0) {
      panel.addEventListener('animationend', finish, { once: true })
      setTimeout(finish, this._options.animationDuration + 50)
    } else {
      finish()
    }
  }
}
