import { Subject, takeUntil } from 'rxjs'
import { OverlayRef as CdkOverlayRef } from '@angular/cdk/overlay'
import { OverlayFocusManager } from '../focus'
import { OverlayAnimationPlayer } from '../animation'
import type { OverlayConfig, OverlayRef } from '../models'

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

  const restoreFocusOnce = (): void => {
    if (isFocusRestored) return
    isFocusRestored = true
    focus.restore(snapshot, trap)
  }

  const finishClose = (): void => {
    if (isDisposed) return
    isDisposed = true

    restoreFocusOnce()

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
    hostElement: cdkRef.hostElement,
    overlayElement: cdkRef.overlayElement,
    get isClosed(): boolean {
      return isDisposed
    },
    closed$: afterClosed$.asObservable(),
    close,
    updatePosition: () => cdkRef.updatePosition(),
    updatePositionStrategy: positionStrategy =>
      cdkRef.updatePositionStrategy(positionStrategy),
    updateScrollStrategy: scrollStrategy =>
      cdkRef.updateScrollStrategy(scrollStrategy),
    keydownEvents: () => cdkRef.keydownEvents(),
    backdropClick: () => cdkRef.backdropClick(),
    focusInitialElement: () => focus.focusInitial(trap, cdkRef.overlayElement),
    restoreFocus: restoreFocusOnce
  }
}
