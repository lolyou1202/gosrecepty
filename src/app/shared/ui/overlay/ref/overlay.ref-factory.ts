import { Subject, takeUntil } from 'rxjs'
import { OverlayRef as CdkOverlayRef } from '@angular/cdk/overlay'
import { OverlayFocusManager } from '../focus'
import { OverlayAnimationPlayer } from '../animation'
import type { OverlayConfig, OverlayRef } from '../models'
import { OVERLAY_BACKDROP_DARK_CLASS } from '../utils/constants'

export function createOverlayRef(
  cdkRef: CdkOverlayRef,
  id: string,
  config: OverlayConfig,
  animations: OverlayAnimationPlayer,
  focus: OverlayFocusManager
): OverlayRef {
  const afterClosed$ = new Subject<void>()
  const snapshot = focus.capture()

  const trap = focus.createTrap(cdkRef.overlayElement)

  const hasBackdrop = config.hasBackdrop ?? true
  const shouldCloseOnBackdrop =
    config.closeOnBackdropClick !== false && hasBackdrop

  let isClosing = false
  let isDisposed = false
  let isFocusRestored = false

  const restoreFocus = (): void => {
    if (isFocusRestored) return
    isFocusRestored = true
    focus.restore(snapshot, trap)
  }

  const finishClose = (): void => {
    if (isDisposed) return
    isDisposed = true

    restoreFocus()

    afterClosed$.next()
    afterClosed$.complete()
    cdkRef.dispose()
  }

  const close = (): void => {
    if (isClosing || isDisposed) return
    isClosing = true

    const overlayElement = cdkRef.overlayElement
    if (!overlayElement) {
      finishClose()
      return
    }
    animations.playClosing(cdkRef, config, finishClose)
  }

  const updateBackdropDarkness = (isDark: boolean): void => {
    const backdrop = cdkRef.backdropElement
    if (!backdrop) return

    if (isDark) {
      backdrop.classList.add(OVERLAY_BACKDROP_DARK_CLASS)
    } else {
      backdrop.classList.remove(OVERLAY_BACKDROP_DARK_CLASS)
    }
  }

  if (shouldCloseOnBackdrop) {
    cdkRef
      .backdropClick()
      .pipe(takeUntil(afterClosed$))
      .subscribe(() => close())
  }

  if (config.closeOnEsc !== false) {
    cdkRef
      .keydownEvents()
      .pipe(takeUntil(afterClosed$))
      .subscribe(event => {
        if (event.code === 'Escape' && !event.defaultPrevented) close()
      })
  }

  cdkRef
    .detachments()
    .pipe(takeUntil(afterClosed$))
    .subscribe(() => finishClose())

  return {
    id,
    closed$: afterClosed$.asObservable(),
    close,
    focusInitialElement: () => focus.focusInitial(trap, cdkRef.overlayElement),
    restoreFocus,

    backdropElement: cdkRef.backdropElement,
    hostElement: cdkRef.hostElement,
    overlayElement: cdkRef.overlayElement,
    addPanelClass: classes => cdkRef.addPanelClass(classes),
    removePanelClass: classes => cdkRef.removePanelClass(classes),
    updateSize: config => cdkRef.updateSize(config),
    updatePosition: () => cdkRef.updatePosition(),
    updatePositionStrategy: strategy => cdkRef.updatePositionStrategy(strategy),
    updateScrollStrategy: strategy => cdkRef.updateScrollStrategy(strategy),
		updateBackdropDarkness,
    backdropClick: () => cdkRef.backdropClick(),
    keydownEvents: () => cdkRef.keydownEvents()
  }
}
