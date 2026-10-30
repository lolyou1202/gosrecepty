import {
  ElementRef,
  Injectable,
  Injector,
  TemplateRef,
  Type,
  inject
} from '@angular/core'
import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
  ScrollStrategy
} from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { PopoverHostComponent } from './popover-host.component'
import { PopoverRef } from './popover.ref'
import { POPOVER_DATA, POPOVER_REF } from './popover.tokens'
import {
  PopoverComponentConfig,
  PopoverConfig,
  PopoverTemplateConfig
} from './popover.model'

const DEFAULT_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: 4
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -4
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetY: 4
  },
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetY: -4
  }
]

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

@Injectable({ providedIn: 'root' })
export class PopoverService {
  private readonly _overlay = inject(Overlay)
  private readonly _parentInjector = inject(Injector)

  public open<C = unknown, D = unknown, R = unknown>(
    component: Type<C>,
    config: PopoverComponentConfig<D>
  ): PopoverRef<R>

  public open<C = unknown, D = unknown, R = unknown>(
    template: TemplateRef<C>,
    config: PopoverTemplateConfig<C, D>
  ): PopoverRef<R>

  public open<C = unknown, D = unknown, R = unknown>(
    componentOrTemplate: Type<C> | TemplateRef<C>,
    config: PopoverComponentConfig<D> & PopoverTemplateConfig<C, D>
  ): PopoverRef<R> {
    const fullConfig: PopoverConfig<C, D> =
      componentOrTemplate instanceof TemplateRef
        ? ({ ...config, template: componentOrTemplate } as PopoverConfig<C, D>)
        : ({ ...config, component: componentOrTemplate } as PopoverConfig<C, D>)

    const overlayRef = this._createOverlay(fullConfig)
    const popoverRef = new PopoverRef<R>(overlayRef, { animationDuration: 200 })

    const injector = Injector.create({
      parent: this._parentInjector,
      providers: [
        { provide: POPOVER_DATA, useValue: fullConfig },
        { provide: POPOVER_REF, useValue: popoverRef }
      ]
    })

    overlayRef.attach(new ComponentPortal(PopoverHostComponent, null, injector))

    this._bindClose(overlayRef, popoverRef, fullConfig)
    this._applyTriggerWidth(overlayRef, fullConfig)
    this._handleFocus(overlayRef, popoverRef, fullConfig)

    return popoverRef
  }

  private _createOverlay<C, D>(config: PopoverConfig<C, D>): OverlayRef {
    const positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(config.origin)
      .withPositions(config.positions ?? DEFAULT_POSITIONS)
      .withViewportMargin(8)
      .withPush(true)
      .withGrowAfterOpen(true)
      .withFlexibleDimensions(true)

    if (config.offset) {
      positionStrategy.withDefaultOffsetX(config.offset.x ?? 0)
      positionStrategy.withDefaultOffsetY(config.offset.y ?? 0)
    }

    const overlayConfig: OverlayConfig = {
      positionStrategy,
      scrollStrategy: this._scrollStrategy(config.scrollStrategy),
      hasBackdrop: config.closeOnOutsideClick !== false,
      backdropClass: config.backdropClass ?? 'popover-backdrop-transparent',
      panelClass: [
        'popover-panel',
        config.disableAnimation ? 'popover-panel--no-animation' : '',
        ...(Array.isArray(config.panelClass)
          ? config.panelClass
          : config.panelClass
            ? [config.panelClass]
            : [])
      ],
      width: this._resolveWidth(config),
      minWidth: config.minWidth ? `${config.minWidth}px` : undefined,
      maxWidth: config.maxWidth ? `${config.maxWidth}px` : undefined,
      maxHeight: config.maxHeight ? `${config.maxHeight}px` : undefined,
      disableAnimations: config.disableAnimation ?? false
    }

    return this._overlay.create(overlayConfig)
  }

  private _scrollStrategy(
    name: PopoverConfig['scrollStrategy']
  ): ScrollStrategy {
    switch (name ?? 'reposition') {
      case 'reposition':
        return this._overlay.scrollStrategies.reposition()
      case 'block':
        return this._overlay.scrollStrategies.block()
      case 'close':
        return this._overlay.scrollStrategies.close()
      case 'noop':
        return this._overlay.scrollStrategies.noop()
    }
  }

  private _resolveWidth<C, D>(config: PopoverConfig<C, D>): string | undefined {
    if (
      !config.width ||
      config.width === 'auto' ||
      config.width === 'trigger'
    ) {
      return undefined
    }
    return `${config.width}px`
  }

  private _applyTriggerWidth<C, D>(
    overlayRef: OverlayRef,
    config: PopoverConfig<C, D>
  ): () => void {
    if (config.width !== 'trigger') return () => {}
    const el = this._resolveOriginElement(config.origin)
    if (!el) return () => {}

    const observer = new ResizeObserver(() => {
      overlayRef.updateSize({ width: `${el.getBoundingClientRect().width}px` })
    })
    observer.observe(el)
    overlayRef.updateSize({ width: `${el.getBoundingClientRect().width}px` })

    return () => observer.disconnect()
  }

  private _bindClose<C, D, R>(
    overlayRef: OverlayRef,
    ref: PopoverRef<R>,
    config: PopoverConfig<C, D>
  ): void {
    if (config.closeOnOutsideClick !== false) {
      overlayRef
        .backdropClick()
        .subscribe(() => ref.close(undefined, 'outside'))
    }
    if (config.closeOnEscape !== false) {
      overlayRef.keydownEvents().subscribe(event => {
        if (event.key === 'Escape') ref.close(undefined, 'escape')
      })
    }
  }

  private _handleFocus<C, D, R>(
    overlayRef: OverlayRef,
    ref: PopoverRef<R>,
    config: PopoverConfig<C, D>
  ): void {
    if (config.autoFocus !== false) {
      queueMicrotask(() => {
        const host = overlayRef.overlayElement
        const first = host.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        ;(first ?? host).focus?.()
      })
    }

    if (config.restoreFocus !== false) {
      const originEl = this._resolveOriginElement(config.origin)
      ref.afterClosed$.subscribe(() => {
        if (originEl instanceof HTMLElement) originEl.focus?.()
      })
    }
  }

  private _resolveOriginElement(
    origin: PopoverConfig['origin']
  ): HTMLElement | null {
    if (!origin) return null
    if (origin instanceof HTMLElement) return origin
    if (origin instanceof ElementRef) return origin.nativeElement
    return null
  }
}
