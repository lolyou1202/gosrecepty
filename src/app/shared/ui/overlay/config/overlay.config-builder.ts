import { isDevMode } from '@angular/core'
import {
  Overlay as CdkOverlay,
  OverlayConfig as CdkOverlayConfig
} from '@angular/cdk/overlay'
import { clsx } from 'clsx'
import type { OverlayConfig } from '../models'
import {
  OVERLAY_BACKDROP_ANIMATION_DISABLED_CLASS,
  OVERLAY_BACKDROP_CLASS,
  OVERLAY_BACKDROP_DARK_CLASS,
  OVERLAY_PANEL_CLASS
} from '../utils/constants'

export function buildCdkOverlayConfig(
  cdkOverlay: CdkOverlay,
  config: OverlayConfig
): CdkOverlayConfig {
  const positionStrategy =
    config.positionStrategy ??
    cdkOverlay.position().global().centerHorizontally().centerVertically()

  const scrollStrategy =
    config.scrollStrategy ?? cdkOverlay.scrollStrategies.block()

  const hasBackdrop = config.hasBackdrop ?? true

  const closeOnBackdropClick =
    config.closeOnBackdropClick !== false && hasBackdrop

  if (isDevMode() && closeOnBackdropClick !== false && !hasBackdrop) {
    console.warn(
      '[OverlayService] closeOnBackdropClick ignored: hasBackdrop is false. Backdrop clicks cannot be captured without a backdrop.'
    )
  }

  const backdropClass = clsx(
    OVERLAY_BACKDROP_CLASS,
    config.darkBackdrop && OVERLAY_BACKDROP_DARK_CLASS,
    config.animationDisabled && OVERLAY_BACKDROP_ANIMATION_DISABLED_CLASS,
    config.backdropClass
  )
    .split(/\s+/)
    .filter(Boolean)

  const panelShadowClass =
    config.panelShadow && config.panelShadow !== 'none'
      ? `${OVERLAY_PANEL_CLASS}--shadow-${config.panelShadow}`
      : null

  const panelClass = clsx(
    OVERLAY_PANEL_CLASS,
    panelShadowClass,
    config.panelClass
  )
    .split(/\s+/)
    .filter(Boolean)

  const {
    openingDuration,
    closingDuration,
    animationDisabled,
    darkBackdrop,
    panelShadow,
    origin,
    restoreFocus,
    ...cdkFields
  } = config

  return {
    ...cdkFields,
    positionStrategy,
    scrollStrategy,
    hasBackdrop,
    backdropClass,
    panelClass
  }
}
