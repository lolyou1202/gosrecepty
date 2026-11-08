import { TemplateRef, Type } from '@angular/core'
import { ModalComponentConfig } from './modal-component-config.model'
import { ModalTemplateConfig } from './modal-template-config.model'

export type ModalConfig<C = unknown, D = unknown, R = unknown> =
  | (ModalComponentConfig<D, R> & { component: Type<C> })
  | (ModalTemplateConfig<C, D, R> & { template: TemplateRef<C> })
