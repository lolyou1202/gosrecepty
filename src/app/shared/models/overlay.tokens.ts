import { InjectionToken } from '@angular/core'
import { OverlayBaseConfig } from './overlay.types'
import { OverlayRef as CdkOverlayRef } from '@angular/cdk/overlay'

export const OVERLAY_DATA = new InjectionToken<unknown>('OVERLAY_DATA')
export const OVERLAY_REF = new InjectionToken<CdkOverlayRef>('OVERLAY_REF')
export const OVERLAY_CONFIG = new InjectionToken<OverlayBaseConfig>('OVERLAY_CONFIG')
