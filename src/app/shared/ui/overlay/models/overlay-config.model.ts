import { PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay'

export interface OverlayConfig {
  origin?: HTMLElement
  positionStrategy?: PositionStrategy
  scrollStrategy?: ScrollStrategy
  closeOnBackdropClick?: boolean
  openingDuration?: number
  closingDuration?: number
  animationDisabled?: boolean
  restoreFocus?: boolean
  closeOnEsc?: boolean
  hasBackdrop?: boolean
  darkBackdrop?: boolean
  backdropClass?: string
  panelClass?: string
  panelShadow?: 'default' | 'popup' | 'modal' | 'none'
}
