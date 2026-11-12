import { Injectable, TemplateRef, Type, inject } from '@angular/core'
import { skip, takeUntil } from 'rxjs'
import { PositionStrategy } from '@angular/cdk/overlay'
import { OverlayService } from '@shared/ui/overlay'
import { LayoutService } from '@shared/utils/services/layout.service'
import { OverlayConfig, OverlayRef } from '@shared/ui/overlay/models'
import { PopupComponent } from './popup.component'
import { PopupOverlayRef } from './ref/popup-ref'
import type {
  PopupComponentConfig,
  PopupConfig,
  PopupTemplateConfig
} from './models'

@Injectable({ providedIn: 'root' })
export class PopupService {
  private readonly _overlay = inject(OverlayService)
  private readonly _layout = inject(LayoutService)

  public open<C = unknown, D = unknown>(
    origin: HTMLElement,
    component: Type<C>,
    config?: PopupComponentConfig<D>
  ): PopupOverlayRef
  public open<C = unknown, D = unknown>(
    origin: HTMLElement,
    template: TemplateRef<C>,
    config?: PopupTemplateConfig<C, D>
  ): PopupOverlayRef
  public open<C = unknown, D = unknown>(
    origin: HTMLElement,
    componentOrTemplate: Type<C> | TemplateRef<C>,
    config: PopupComponentConfig<D> & PopupTemplateConfig<C, D>
  ): PopupOverlayRef {
    const popupConfig: PopupConfig<C, D> =
      componentOrTemplate instanceof TemplateRef
        ? { ...config, template: componentOrTemplate }
        : { ...config, component: componentOrTemplate }

    const isMobile = this._layout.isMobile()

    const overlayConfig: OverlayConfig = {
      positionStrategy: this._getPositionStrategy(isMobile, origin),
      width: isMobile ? undefined : config.width,
			openingDuration: 200,
      closingDuration: 200,
      hasBackdrop: true,
      darkBackdrop: isMobile,
      closeOnBackdropClick: true,
      closeOnEsc: true,
      panelClass: 'popup-panel'
    }

    const popupRef = new PopupOverlayRef()

    const overlayRef = this._overlay.create<PopupComponent<C, D>>({
      component: PopupComponent,
      config: overlayConfig,
      initialInputs: {
        config: popupConfig
      }
    })

    this._layout.isMobile$
      .pipe(skip(1), takeUntil(overlayRef.closed$))
      .subscribe(isMobile => {
        this._updateResponsiveLayout(overlayRef, isMobile, origin, config.width)
      })

    popupRef.attach(overlayRef)

    return popupRef
  }

  private _updateResponsiveLayout(
    overlayRef: OverlayRef,
    isMobile: boolean,
    origin: HTMLElement,
    width?: number
  ): void {
    overlayRef.updatePositionStrategy(
      this._getPositionStrategy(isMobile, origin)
    )
    overlayRef.updateSize({ width: isMobile ? undefined : width })
    overlayRef.updateBackdropDarkness(isMobile)
  }

  private _getPositionStrategy(
    isMobile: boolean,
    origin: HTMLElement
  ): PositionStrategy {
    return isMobile
      ? this._overlay.position().global().bottom().centerHorizontally()
      : this._overlay
          .position()
          .flexibleConnectedTo(origin)
          .withPositions([
            {
              originX: 'start',
              originY: 'bottom',
              overlayX: 'start',
              overlayY: 'top',
              offsetY: 8
            }
          ])
  }
}
