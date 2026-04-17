import { inject, Injectable, Type } from '@angular/core'
import { OverlayService } from './overlay.service'
import { OverlayRef } from '../models/overlay.types'
import { ModalConfig } from '../models/modal.types'

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly _overlay = inject(OverlayService)

  public open<C>(
    component: Type<C>,
    config: ModalConfig,
    data?: unknown
  ): OverlayRef {
    return this._overlay.open(
      component,
      { ...config, panelShadow: 'modal', darkBackdrop: true },
      data
    )
  }
}
