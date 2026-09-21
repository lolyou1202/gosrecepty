import {
  EnvironmentInjector,
  Injectable,
  Injector,
  Type,
  inject,
  signal
} from '@angular/core'
import {
  Overlay as CdkOverlay,
  OverlayRef as CdkOverlayRef,
  OverlayConfig as CdkOverlayConfig,
  OverlayPositionBuilder
} from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { Subject } from 'rxjs'
import { OverlayBaseConfig, OverlayRef } from '../models/overlay.model'
import {
  OVERLAY_CONFIG,
  OVERLAY_DATA,
  OVERLAY_REF
} from '../models/overlay.tokens'
import { clsx } from 'clsx'
import { ComponentInputValues } from '../../utils/input-value.type'

@Injectable({ providedIn: 'root' })
export class OverlayService {
  private readonly _cdkOverlay = inject(CdkOverlay)
  private readonly _injector = inject(EnvironmentInjector)

  private readonly _stack = signal<
    {
      id: string
      ref: OverlayRef
    }[]
  >([])

  public create<T>({
    component,
    config,
    data,
    initialInputs
  }: {
    component: Type<T>
    config: OverlayBaseConfig
    data?: unknown
    initialInputs?: ComponentInputValues<T>
  }): OverlayRef {
    const id = `overlay_${crypto.randomUUID()}`
    const cdkConfig = this._buildCdkConfig(config)
    const cdkRef = this._cdkOverlay.create(cdkConfig)
    const overlayRef = this._createOverlayRef(cdkRef, id, config)

    const injector = Injector.create({
      providers: [
        { provide: OVERLAY_REF, useValue: overlayRef },
        { provide: OVERLAY_CONFIG, useValue: config },
        { provide: OVERLAY_DATA, useValue: data }
      ],
      parent: this._injector
    })

    const portal = new ComponentPortal(component, null, injector)
    const componentRef = cdkRef.attach(portal)

    this._applyAnimation(cdkRef.overlayElement, config, 'opening')

    if (initialInputs) {
      Object.entries(initialInputs).forEach(([key, value]) => {
        componentRef.setInput(key, value)
      })
    }

    this._stack.update(_stack => [
      ..._stack,
      {
        id,
        ref: overlayRef
      }
    ])

    this._setupAutoClose(cdkRef, config, overlayRef.close)

    overlayRef.closed.subscribe(() => this._removeFromStack(id))

    return overlayRef
  }

  public position(): OverlayPositionBuilder {
    return this._cdkOverlay.position()
  }

  public closeAll(): void {
    ;[...this._stack()].reverse().forEach(el => el.ref.close())
  }

  private _removeFromStack(id: string): void {
    this._stack.update(_stack => _stack.filter(el => el.id !== id))
  }

  private _createOverlayRef(
    cdkRef: CdkOverlayRef,
    id: string,
    config: OverlayBaseConfig
  ): OverlayRef {
    const afterClosed$ = new Subject<void>()

    let isClosing = false
    let isDisposed = false

    const finishClose = (): void => {
      if (isDisposed) return
      isDisposed = true
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

      this._applyAnimation(overlayElement, config, 'closing', finishClose)
    }

    return {
      id,
      closed: afterClosed$.asObservable(),
      close,
      cdkRef
    }
  }

  private _setupAutoClose(
    cdkRef: CdkOverlayRef,
    config: OverlayBaseConfig,
    closeFn: () => void
  ): void {
    if (config.closeOnBackdropClick !== false) {
      cdkRef.backdropClick().subscribe(() => closeFn())
    }

    if (config.closeOnEsc !== false) {
      cdkRef.keydownEvents().subscribe(event => {
        if (event.code === 'Escape') closeFn()
      })
    }
  }

  private _buildCdkConfig(config: OverlayBaseConfig): CdkOverlayConfig {
    const positionStrategy =
      config.positionStrategy ??
      this._cdkOverlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically()

    const scrollStrategy =
      config.scrollStrategy ?? this._cdkOverlay.scrollStrategies.block()

    const hasBackdrop = config.hasBackdrop ?? true

    const backdropClass = clsx(
      'overlay-backdrop',
      config.darkBackdrop && 'overlay-backdrop-dark',
      config.backdropClass
    ).split(' ')

    const panelClass = clsx(
      'overlay-panel',
      config.panelShadow ?? `overlay-panel-shadow-${config.panelShadow}`,
      config.panelClass
    ).split(' ')

    return {
      ...config,
      positionStrategy,
      scrollStrategy,
      hasBackdrop,
      backdropClass,
      panelClass
    }
  }

  private _applyAnimation(
    element: HTMLElement,
    config: OverlayBaseConfig,
    phase: 'opening' | 'closing',
    onDone?: () => void
  ): void {
    const duration = config.animationDuration
    if (!duration || config.disableAnimation) {
      onDone?.()
      return
    }

    const selector = '.overlay-panel'
    const panel = element.matches(selector)
      ? element
      : (element.querySelector(selector) as HTMLElement)

    if (!panel) {
      onDone?.()
      return
    }

    const animationClass = `--${phase}`

    if (phase === 'opening') {
      panel.style.animationDuration = `${duration}ms`
      panel.classList.add(animationClass)
      panel.addEventListener(
        'animationend',
        () => {
          panel.classList.remove(animationClass)
        },
        { once: true }
      )
      onDone?.()
    } else {
      panel.classList.add(animationClass)
      panel.addEventListener('animationend', () => onDone?.(), { once: true })
      setTimeout(() => onDone?.(), duration)
    }
  }
}
