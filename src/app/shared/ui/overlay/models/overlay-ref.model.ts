import {
  OverlaySizeConfig,
  PositionStrategy,
  ScrollStrategy
} from '@angular/cdk/overlay'
import { Observable } from 'rxjs'

export interface OverlayRef {
  id: string
  closed$: Observable<void>
  close(): void
  focusInitialElement(): void
  restoreFocus(): void

  // Проксируем методы CDK, которые нужны сервисам
  backdropElement: HTMLElement | null
  hostElement: HTMLElement
  overlayElement: HTMLElement
  addPanelClass(classes: string | string[]): void
  removePanelClass(classes: string | string[]): void
  updateSize(sizeConfig: OverlaySizeConfig): void
  updatePosition(): void
  updatePositionStrategy(strategy: PositionStrategy): void
  updateScrollStrategy(strategy: ScrollStrategy): void
	updateBackdropDarkness(isDark: boolean): void
  backdropClick(): Observable<MouseEvent>
  keydownEvents(): Observable<KeyboardEvent>
}
