import {
  Injectable,
  Injector,
  Type,
  inject,
  DestroyRef,
  signal
} from '@angular/core'
import {
  Overlay,
  OverlayRef as CdkOverlayRef,
  OverlayConfig as CdkOverlayConfig,
  PositionStrategy,
  ConnectionPositionPair
} from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { Subject } from 'rxjs'
import { OverlayBaseConfig, OverlayRef } from '../models/overlay.types'
import {
  OVERLAY_CONFIG,
  OVERLAY_DATA,
  OVERLAY_REF
} from '../models/overlay.tokens'
import { clsx } from 'clsx'

const OFFSET_MARGIN = 8

@Injectable({ providedIn: 'root' })
export class OverlayService {
  protected readonly overlay = inject(Overlay)
  protected readonly injector = inject(Injector)
  protected readonly destroyRef = inject(DestroyRef)

  private readonly _stack = signal<
    {
      id: string
      ref: OverlayRef
    }[]
  >([])

  public open<T>(
    component: Type<T>,
    config: OverlayBaseConfig,
    data?: unknown
  ): OverlayRef {
    const id = this._generateId()
    const cdkConfig = this._buildCdkConfig(config)
    const cdkRef = this.overlay.create(cdkConfig)

    const overlayRef = this._createOverlayRef(cdkRef, id)

    const injector = Injector.create({
      providers: [
        { provide: OVERLAY_REF, useValue: overlayRef },
        { provide: OVERLAY_CONFIG, useValue: config },
        { provide: OVERLAY_DATA, useValue: data }
      ],
      parent: this.injector
    })

    const portal = new ComponentPortal(component, null, injector)
    cdkRef.attach(portal)

    this._stack.update(_stack => [
      ..._stack,
      {
        id,
        ref: overlayRef
      }
    ])

    this._setupAutoClose(cdkRef, config)

    overlayRef.closed.subscribe(() => this._removeFromStack(id))

    return overlayRef
  }

  public closeAll(): void {
    ;[...this._stack()].reverse().forEach(el => el.ref.close())
  }

  private _generateId(): string {
    return `overlay_${crypto.randomUUID()}`
  }

  private _removeFromStack(id: string): void {
    this._stack.update(_stack => _stack.filter(el => el.id !== id))
  }

  private _createOverlayRef(cdkRef: CdkOverlayRef, id: string): OverlayRef {
    const afterClosed$ = new Subject<void>()

    return {
      id,
      closed: afterClosed$.asObservable(),
      close: (): void => {
        afterClosed$.next()
        afterClosed$.complete()
        cdkRef.dispose()
      },
      cdkRef
    }
  }

  private _setupAutoClose(
    cdkRef: CdkOverlayRef,
    config: OverlayBaseConfig
  ): void {
    cdkRef.detachments().subscribe(() => cdkRef.dispose())

    if (config.closeOnBackdropClick !== false) {
      cdkRef.backdropClick().subscribe(() => cdkRef.dispose())
    }

    if (config.closeOnEsc !== false) {
      cdkRef.keydownEvents().subscribe(event => {
        if (event.code === 'Escape') cdkRef.dispose()
      })
    }
  }

  private _buildCdkConfig(config: OverlayBaseConfig): CdkOverlayConfig {
    const positionStrategy = this._getPositionStrategy(
      config.origin,
      config.positions
    )

    const scrollStrategy = this.overlay.scrollStrategies.block()

    const backdropClass = clsx(
      'overlay-backdrop',
      config.darkBackdrop && 'overlay-backdrop-dark',
      config.backdropClass
    ).split(' ')

    const panelClass = clsx(
      'overlay-panel',
      `overlay-panel-shadow-${config.panelShadow}`,
      config.panelClass
    ).split(' ')

    return {
      positionStrategy,
      scrollStrategy,
      hasBackdrop: true,
      backdropClass,
      panelClass
    }
  }

  private _getPositionStrategy(
    origin?: HTMLElement,
    positions?: ConnectionPositionPair[]
  ): PositionStrategy {
    if (!origin) {
      return this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically()
    } else {
      return this.overlay
        .position()
        .flexibleConnectedTo(origin)
        .withPositions(
          positions || [
            {
              originX: 'start',
              originY: 'bottom',
              overlayX: 'start',
              overlayY: 'top',
              offsetY: OFFSET_MARGIN
            },
            {
              originX: 'start',
              originY: 'top',
              overlayX: 'start',
              overlayY: 'bottom',
              offsetY: -OFFSET_MARGIN
            },
            {
              originX: 'end',
              originY: 'bottom',
              overlayX: 'end',
              overlayY: 'top',
              offsetY: OFFSET_MARGIN
            },
            {
              originX: 'end',
              originY: 'top',
              overlayX: 'end',
              overlayY: 'bottom',
              offsetY: -OFFSET_MARGIN
            }
          ]
        )
        .withPush(true)
        .withViewportMargin(OFFSET_MARGIN)
    }
  }
}
