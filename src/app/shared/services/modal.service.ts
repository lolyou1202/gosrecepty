import { inject, Injectable, TemplateRef, Type } from '@angular/core'
import { OverlayService } from './overlay.service'
import { OverlayRef } from '../models/overlay.model'
import { ModalConfig } from '../models/modal.model'
import { ModalComponent } from '../ui/modal/modal.component'
import { ComponentInputValues } from '../../utils/input-value.type'

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly _overlayService = inject(OverlayService)

  public open<T>(
    options:
      | {
          component: Type<T>
          initialInputs?: ComponentInputValues<T>
          config: ModalConfig
          data?: Record<string, unknown>
        }
      | {
          template: TemplateRef<T>
          config: ModalConfig
          data?: Record<string, unknown>
        }
  ): OverlayRef {
    const positionStrategy = this._overlayService
      .position()
      .global()
      .centerHorizontally()
      .centerVertically()

    const overlayConfig = {
      ...options.config,
      panelShadow: 'modal',
      darkBackdrop: true,
      positionStrategy
    } as const

    if ('template' in options) {
      const { template, data } = options

      return this._overlayService.create({
        component: ModalComponent,
        initialInputs: {
          contentTemplate: template
        },
        config: overlayConfig,
        data: {
          ...data,
          contentTemplate: template
        }
      })
    }

    if ('component' in options) {
      const { component, data, initialInputs } = options

      return this._overlayService.create({
        component: ModalComponent,
        initialInputs: {
          contentComponent: component,
          contentComponentInputs: initialInputs
        },
        config: overlayConfig,
        data
      })
    }

    throw new Error('Необходимо предоставить либо компонент, либо шаблон')
  }
}
