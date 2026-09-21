import { PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay'
import { OverlayRef as CdkOverlayRef } from '@angular/cdk/overlay'
import { Observable } from 'rxjs'

export interface OverlayRef {
  id: string
  closed: Observable<void>
  close(): void
  readonly cdkRef: CdkOverlayRef
}

export interface OverlayBaseConfig {
  origin?: HTMLElement
  positionStrategy?: PositionStrategy
  scrollStrategy?: ScrollStrategy
  closeOnBackdropClick?: boolean
	animationDuration?: number
	disableAnimation?: boolean
  closeOnEsc?: boolean
  hasBackdrop?: boolean
  darkBackdrop?: boolean
  backdropClass?: string
  panelClass?: string
  panelShadow?: 'default' | 'popup' | 'modal' | 'none'
}
