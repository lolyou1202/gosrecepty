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
  REDUCED_MOTION_QUERY,
  OVERLAY_BACKDROP_CLOSING_CLASS,
  OVERLAY_BACKDROP_OPENING_CLASS,
	OVERLAY_COMPONENT_SELECTOR
} from '../utils/constants'

@Injectable({ providedIn: 'root' })
export class OverlayAnimationPlayer {
  private readonly _document = inject(DOCUMENT)
  private readonly _platformId = inject(PLATFORM_ID)

  public playOpening(cdkRef: CdkOverlayRef, config: OverlayConfig): void {
    if (!this._shouldAnimate(config, 'opening')) return
    const duration = this._resolveDuration(config, 'opening')

    // 1. Открываем панель
    const panel = this._findPanel(cdkRef.overlayElement)
    if (panel) {
      this._animate(panel, OVERLAY_OPENING_CLASS, duration)
    }

    // 2. Открываем бэкдроп (параллельно)
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

    if (cdkRef.backdropElement) {
      this._animate(
        cdkRef.backdropElement,
        OVERLAY_BACKDROP_CLOSING_CLASS,
        duration,
        undefined,
        true
      )
    }

    const panel = this._findPanel(cdkRef.overlayElement)
    if (panel) {
      this._animate(panel, OVERLAY_CLOSING_CLASS, duration, onDone, true)
    } else {
      setTimeout(onDone, duration)
    }
  }

  private _findPanel(overlayElement: HTMLElement): HTMLElement | null {
    if (overlayElement.matches(OVERLAY_COMPONENT_SELECTOR)) {
      return overlayElement
    }
    const panel = overlayElement.querySelector<HTMLElement>(
      OVERLAY_COMPONENT_SELECTOR
    )
    return panel || null
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
    onDone: () => void = () => {},
    isClosing = false
  ): void {
    let finished = false
    let timer: ReturnType<typeof setTimeout> | undefined = undefined

    const finish = (): void => {
      if (finished) return
      finished = true
      element.removeEventListener('animationend', onAnimationEnd)
      globalThis.clearTimeout(timer)

      onDone()

      if (!isClosing) {
        element.classList.remove(className)
        element.style.removeProperty('animation-duration')
      }
    }

    const onAnimationEnd = (event: AnimationEvent): void => {
      if (event.target !== element) return
      finish()
    }

    element.style.animationDuration = `${duration}ms`
    element.addEventListener('animationend', onAnimationEnd)
    element.classList.add(className)

    // Страховочный таймаут на случай, если animationend не пришел
    timer = globalThis.setTimeout(finish, duration + ANIMATION_SAFETY_MARGIN)
  }
}
