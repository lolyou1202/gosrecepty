import { Injectable, PLATFORM_ID, inject } from '@angular/core'
import { DOCUMENT, isPlatformBrowser } from '@angular/common'
import { OverlayRef as CdkOverlayRef } from '@angular/cdk/overlay'
import type { OverlayAnimationPhase, OverlayConfig } from '../models'
import {
  ANIMATION_SAFETY_MARGIN,
  DEFAULT_CLOSING_DURATION,
  DEFAULT_OPENING_DURATION,
  OVERLAY_CLOSING_CLASS,
  OVERLAY_OPENING_CLASS,
  OVERLAY_PANEL_SELECTOR,
  REDUCED_MOTION_QUERY,
  OVERLAY_BACKDROP_CLOSING_CLASS,
  OVERLAY_BACKDROP_OPENING_CLASS
} from '../utils/constants'

@Injectable({ providedIn: 'root' })
export class OverlayAnimationPlayer {
  private readonly _document = inject(DOCUMENT)
  private readonly _platformId = inject(PLATFORM_ID)

  public playOpening(cdkRef: CdkOverlayRef, config: OverlayConfig): void {
    if (!this._shouldAnimate(config, 'opening')) return
    const duration = this._resolveDuration(config, 'opening')

    const panel = this._findPanel(cdkRef.overlayElement)
    if (panel) {
      this._animate(panel, OVERLAY_OPENING_CLASS, duration)
    }

    if (cdkRef.backdropElement) {
      this._animate(
        cdkRef.backdropElement,
        OVERLAY_BACKDROP_OPENING_CLASS,
        duration
      )
    }
  }

  public playClosing(
    cdkRef: CdkOverlayRef,
    config: OverlayConfig,
    onDone: () => void
  ): void {
    if (!this._shouldAnimate(config, 'closing')) {
      onDone()
      return
    }
    const duration = this._resolveDuration(config, 'closing')

    let activeAnimations = 1
    const onAnimationComplete = (): void => {
      activeAnimations--
      if (activeAnimations === 0) onDone()
    }

    const panel = this._findPanel(cdkRef.overlayElement)
    if (panel) {
      this._animate(panel, OVERLAY_CLOSING_CLASS, duration, onAnimationComplete)
    } else {
      setTimeout(onAnimationComplete, duration)
    }

    if (cdkRef.backdropElement) {
      activeAnimations++
      this._animate(
        cdkRef.backdropElement,
        OVERLAY_BACKDROP_CLOSING_CLASS,
        duration,
        onAnimationComplete
      )
    }
  }

  private _findPanel(overlayElement: HTMLElement): HTMLElement | null {
    if (overlayElement.matches(OVERLAY_PANEL_SELECTOR)) return overlayElement
    return overlayElement.querySelector<HTMLElement>(OVERLAY_PANEL_SELECTOR)
  }

  private _shouldAnimate(
    config: OverlayConfig,
    phase: OverlayAnimationPhase
  ): boolean {
    if (config.animationDisabled) return false
    if (!isPlatformBrowser(this._platformId)) return false
    if (this._prefersReducedMotion()) return false
    return this._resolveDuration(config, phase) > 0
  }

  private _prefersReducedMotion(): boolean {
    const view = this._document.defaultView
    if (!view || typeof view.matchMedia !== 'function') return false
    return view.matchMedia(REDUCED_MOTION_QUERY).matches
  }

  private _resolveDuration(
    config: OverlayConfig,
    phase: OverlayAnimationPhase
  ): number {
    const value =
      phase === 'opening' ? config.openingDuration : config.closingDuration
    if (value !== undefined) return Math.max(0, value)
    return phase === 'opening'
      ? DEFAULT_OPENING_DURATION
      : DEFAULT_CLOSING_DURATION
  }

  private _animate(
    element: HTMLElement,
    className: string,
    duration: number,
    onDone: () => void = () => {}
  ): void {
    let finished = false

    const finish = (): void => {
      if (finished) return
      finished = true
      element.removeEventListener('animationend', onAnimationEnd)
      globalThis.clearTimeout(timer)
      element.classList.remove(className)
      element.style.removeProperty('animation-duration')
      onDone()
    }

    const onAnimationEnd = (event: AnimationEvent): void => {
      if (event.target !== element) return
      finish()
    }

    element.style.animationDuration = `${duration}ms`
    element.addEventListener('animationend', onAnimationEnd)
    element.classList.add(className)

    const timer = globalThis.setTimeout(
      finish,
      duration + ANIMATION_SAFETY_MARGIN
    )
  }
}
