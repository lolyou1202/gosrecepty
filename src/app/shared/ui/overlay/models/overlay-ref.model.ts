import { PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay'
import { Observable } from 'rxjs'

export interface OverlayRef {
  id: string
  isClosed: boolean
  hostElement: HTMLElement
  overlayElement: HTMLElement
  closed$: Observable<void>
  close(): void
  updatePosition(): void
  updatePositionStrategy(positionStrategy: PositionStrategy): void
  updateScrollStrategy(scrollStrategy: ScrollStrategy): void
  keydownEvents(): Observable<KeyboardEvent>
  backdropClick(): Observable<MouseEvent>
  focusInitialElement(): void
  restoreFocus(): void
}
