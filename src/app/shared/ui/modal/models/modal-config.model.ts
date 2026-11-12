import { TemplateRef, Type } from '@angular/core'
import { ModalComponentConfig } from './modal-component-config.model'
import { ModalTemplateConfig } from './modal-template-config.model'

export type ModalConfig<C = unknown, D = unknown> =
  | (ModalComponentConfig<D> & { component: Type<C> })
  | (ModalTemplateConfig<C, D> & { template: TemplateRef<C> })
