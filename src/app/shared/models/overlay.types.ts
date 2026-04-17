import { ConnectionPositionPair } from '@angular/cdk/overlay'
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
  positions?: ConnectionPositionPair[]
  closeOnBackdropClick?: boolean
  closeOnEsc?: boolean
  darkBackdrop?: boolean
  backdropClass?: string
  panelClass?: string
  panelShadow?: 'default' | 'popup' | 'modal'
}
