import { Injectable, TemplateRef, Type, inject } from '@angular/core'
import { OverlayService } from '@shared/ui/overlay'
import { OverlayConfig } from '@shared/ui/overlay/models'
import { LayoutService } from '@shared/utils/services/layout.service'
import { ModalComponent } from './modal.component'
import { ModalOverlayRef } from './ref/modal-ref'
import {
  ModalComponentConfig,
  ModalConfig,
  ModalTemplateConfig
} from './models'
import { PositionStrategy } from '@angular/cdk/overlay'
import { takeUntil } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly _overlay = inject(OverlayService)
  private readonly _layout = inject(LayoutService)

  public open<C = unknown, D = unknown>(
    component: Type<C>,
    config?: ModalComponentConfig<D>
  ): ModalOverlayRef
  public open<C = unknown, D = unknown>(
    template: TemplateRef<C>,
    config?: ModalTemplateConfig<C, D>
  ): ModalOverlayRef
  public open<C = unknown, D = unknown>(
    componentOrTemplate: Type<C> | TemplateRef<C>,
    config: ModalComponentConfig<D> & ModalTemplateConfig<C, D> = {}
  ): ModalOverlayRef {
    const modalConfig: ModalConfig<C, D> =
      componentOrTemplate instanceof TemplateRef
        ? { ...config, template: componentOrTemplate }
        : { ...config, component: componentOrTemplate }

    const overlayConfig: OverlayConfig = {
      positionStrategy: this._getPositionStrategy(this._layout.isMobile()),
      openingDuration: 200,
      closingDuration: 200,
      hasBackdrop: true,
      darkBackdrop: true,
      panelClass: 'modal-panel',
      closeOnBackdropClick: true,
      closeOnEsc: true
    }

    const modalRef = new ModalOverlayRef()

    const overlayRef = this._overlay.create<ModalComponent<C, D>>({
      component: ModalComponent,
      config: overlayConfig,
      initialInputs: {
        config: modalConfig
      }
    })

    this._layout.isMobile$
      .pipe(takeUntil(overlayRef.closed$))
      .subscribe(isMobile => {
        overlayRef.updatePositionStrategy(this._getPositionStrategy(isMobile))
      })

    modalRef.attach(overlayRef)

    return modalRef
  }

  private _getPositionStrategy(isMobile: boolean): PositionStrategy {
    return isMobile
      ? this._overlay.position().global().bottom().centerHorizontally()
      : this._overlay
          .position()
          .global()
          .centerHorizontally()
          .centerVertically()
  }
}
