import { Observable, Subject } from 'rxjs'
import { OverlayRef } from '@shared/ui/overlay/models'
import { Nullable } from '@shared/utils/types'

export class PopupOverlayRef {
  private readonly _afterClosed = new Subject<void>()
  private _overlayRef: Nullable<OverlayRef> = null

  private get ref(): OverlayRef {
    if (!this._overlayRef) {
      throw new Error(
        'PopupOverlayRef is not attached yet. Call attach() first.'
      )
    }
    return this._overlayRef
  }

  public attach(overlayRef: OverlayRef): void {
    this._overlayRef = overlayRef

    overlayRef.closed$.subscribe(() => {
      this._afterClosed.next()
      this._afterClosed.complete()
    })
  }

  public close(): void {
    this.ref.close()
  }

  public afterClosed(): Observable<void> {
    return this._afterClosed.asObservable()
  }

  public backdropClick(): Observable<MouseEvent> {
    return this.ref.backdropClick()
  }

  public keydownEvents(): Observable<KeyboardEvent> {
    return this.ref.keydownEvents()
  }

  public updatePosition(): void {
    this.ref.updatePosition()
  }
}
