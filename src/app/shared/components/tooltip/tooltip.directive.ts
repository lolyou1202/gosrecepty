import {
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input,
  signal
} from '@angular/core'
import { ConnectionPositionPair, PositionStrategy } from '@angular/cdk/overlay'
import { OverlayService } from '../../services/overlay.service'
import { TooltipPosition } from './tooltip.model'
import { OverlayRef } from '../../models/overlay.model'
import { TooltipComponent } from './tooltip.component'

@Directive({
  selector: '[appTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focus)': 'show()',
    '(blur)': 'hide()'
  }
})
export class TooltipDirective implements OnDestroy {
  private readonly _overlayService = inject(OverlayService)
  private readonly _elementRef = inject(ElementRef<HTMLElement>)

  public readonly tooltipContent = input.required<string | string[]>()
  public readonly tooltipDelay = input<number>(200)
  public readonly tooltipAnimation = input<number>(200)
  public readonly tooltipDisabled = input<boolean>(false)
  public readonly tooltipPosition = input<TooltipPosition>('top')
  public readonly tooltipColor = input<string>()

  private _overlayRef: OverlayRef | null = null
  private _showTimeout: ReturnType<typeof setTimeout> | null = null
  private _isVisible = signal(false)

  public show(): void {
    if (this.tooltipDisabled() || !this.tooltipContent || this._isVisible())
      return

    if (this._showTimeout) {
      clearTimeout(this._showTimeout)
    }

    this._showTimeout = setTimeout(() => {
      this.createOverlay()
      this._isVisible.set(true)
      this._showTimeout = null
    }, this.tooltipDelay())
  }

  public hide(): void {
    if (this._showTimeout) {
      clearTimeout(this._showTimeout)
      this._showTimeout = null
    }

    if (this._overlayRef) {
      this._overlayRef.close()
      this._overlayRef = null
      this._isVisible.set(false)
    }
  }

  private createOverlay(): void {
    const positionStrategy = this.getPositionStrategy()

    this._overlayRef = this._overlayService.create({
      component: TooltipComponent,
      config: {
        positionStrategy,
        panelShadow: 'none',
        closeOnBackdropClick: false,
        closeOnEsc: false,
        hasBackdrop: false,
        animationDuration: this.tooltipAnimation()
      },
      initialInputs: {
        content: this.tooltipContent(),
        position: this.tooltipPosition(),
        tooltipColor: this.tooltipColor()
      }
    })

    this._overlayRef.closed.subscribe(() => {
      this._overlayRef = null
      this._isVisible.set(false)
    })
  }

  private getPositionStrategy(): PositionStrategy {
    const positions: ConnectionPositionPair[] = []

    switch (this.tooltipPosition()) {
      case 'top':
        positions.push(
          new ConnectionPositionPair(
            { originX: 'center', originY: 'top' },
            { overlayX: 'center', overlayY: 'bottom' },
            0,
            -4
          )
        )
        break

      case 'top-start':
        positions.push(
          new ConnectionPositionPair(
            { originX: 'start', originY: 'top' },
            { overlayX: 'start', overlayY: 'bottom' },
            -8,
            -4
          )
        )
        break

      case 'top-end':
        positions.push(
          new ConnectionPositionPair(
            { originX: 'end', originY: 'top' },
            { overlayX: 'end', overlayY: 'bottom' },
            8,
            -4
          )
        )
        break

      case 'bottom':
        positions.push(
          new ConnectionPositionPair(
            { originX: 'center', originY: 'bottom' },
            { overlayX: 'center', overlayY: 'top' },
            0,
            4
          )
        )
        break

      case 'bottom-start':
        positions.push(
          new ConnectionPositionPair(
            { originX: 'start', originY: 'bottom' },
            { overlayX: 'start', overlayY: 'top' },
            -8,
            4
          )
        )
        break

      case 'bottom-end':
        positions.push(
          new ConnectionPositionPair(
            { originX: 'end', originY: 'bottom' },
            { overlayX: 'end', overlayY: 'top' },
            8,
            4
          )
        )
        break

      case 'left':
        positions.push(
          new ConnectionPositionPair(
            { originX: 'start', originY: 'center' },
            { overlayX: 'end', overlayY: 'center' },
            -8,
            0
          )
        )
        break

      case 'right':
        positions.push(
          new ConnectionPositionPair(
            { originX: 'end', originY: 'center' },
            { overlayX: 'start', overlayY: 'center' },
            8,
            0
          )
        )
        break
    }

    const fallbacks: ConnectionPositionPair[] = [
      new ConnectionPositionPair(
        { originX: 'center', originY: 'bottom' },
        { overlayX: 'center', overlayY: 'top' },
        0,
        8
      ),
      new ConnectionPositionPair(
        { originX: 'center', originY: 'top' },
        { overlayX: 'center', overlayY: 'bottom' },
        0,
        -8
      ),
      new ConnectionPositionPair(
        { originX: 'start', originY: 'center' },
        { overlayX: 'end', overlayY: 'center' },
        -8,
        0
      ),
      new ConnectionPositionPair(
        { originX: 'end', originY: 'center' },
        { overlayX: 'start', overlayY: 'center' },
        8,
        0
      )
    ]

    return this._overlayService
      .position()
      .flexibleConnectedTo(this._elementRef)
      .withPositions([...positions, ...fallbacks])
      .withPush(false)
      .withGrowAfterOpen(false)
      .withViewportMargin(8)
  }

  public ngOnDestroy(): void {
    this.hide()
  }
}
