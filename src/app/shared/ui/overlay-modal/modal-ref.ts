import { Observable, Subject } from 'rxjs'
import { OverlayRef } from '@shared/ui/overlay/models'
import { ModalResult } from './models'
import { Nullable } from '@shared/utils/types'

export class ModalOverlayRef<R = unknown> {
  private readonly _afterClosed = new Subject<ModalResult<R> | undefined>()
  private _result: Nullable<ModalResult<R>>
  private _overlayRef: Nullable<OverlayRef> = null

  private get ref(): OverlayRef {
    if (!this._overlayRef) {
      throw new Error(
        'ModalOverlayRef is not attached yet. Call attach() first.'
      )
    }
    return this._overlayRef
  }

  public attach(overlayRef: OverlayRef): void {
    this._overlayRef = overlayRef

    overlayRef.closed$.subscribe(() => {
      this._afterClosed.next(this._result ?? { action: 'close' })
      this._afterClosed.complete()
    })
  }

  public setResult(result: ModalResult<R>): void {
    this._result = result
  }

  public close(result?: ModalResult<R>): void {
    if (result) this._result = result
    this.ref.close()
  }

  public afterClosed(): Observable<Nullable<ModalResult<R>>> {
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
