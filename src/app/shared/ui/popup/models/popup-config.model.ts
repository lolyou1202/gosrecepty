import { TemplateRef, Type } from '@angular/core'
import { PopupComponentConfig } from './popup-component-config.model'
import { PopupTemplateConfig } from './popup-template-config.model'

export type PopupConfig<C = unknown, D = unknown> =
  | (PopupComponentConfig<D> & { component: Type<C> })
  | (PopupTemplateConfig<C, D> & { template: TemplateRef<C> })
