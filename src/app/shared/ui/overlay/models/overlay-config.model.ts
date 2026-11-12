import { PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay'

export interface OverlayConfig {
  origin?: HTMLElement
  positionStrategy?: PositionStrategy
  scrollStrategy?: ScrollStrategy
  width?: number
  closeOnBackdropClick?: boolean
  openingDuration?: number
  closingDuration?: number
  animationDisabled?: boolean
  restoreFocus?: boolean
  closeOnEsc?: boolean
  hasBackdrop?: boolean
  darkBackdrop?: boolean
	darkBackdropMobile?: boolean
  backdropClass?: string
  panelClass?: string
}
