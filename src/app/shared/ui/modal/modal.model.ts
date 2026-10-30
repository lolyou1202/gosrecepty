import { Signal, TemplateRef, Type } from '@angular/core'
import { DefaultButtonVariant } from '../default-button'

export type ModalResult<R = unknown> =
  { action: 'close' } | { action: 'action'; text: string; payload?: R }

export interface ModalAction<R = unknown, D = unknown> {
  variant: DefaultButtonVariant
  text: string
  disabled?: boolean | Signal<boolean>
  closeOnClick?: boolean
  onClick?: (ctx: D) => R | Promise<R> | void | Promise<void>
}

export interface ModalBaseConfig<D = unknown, R = unknown> {
  title?: string
  data?: D
  actions?: ModalAction<R, D>[]
}

export interface ModalComponentConfig<
  D = unknown,
  R = unknown
> extends ModalBaseConfig<D, R> {
  componentInputs?: Record<string, unknown>
}

export interface ModalTemplateConfig<
  C = unknown,
  D = unknown,
  R = unknown
> extends ModalBaseConfig<D, R> {
  templateContext?: C
}

export type ModalConfig<C = unknown, D = unknown, R = unknown> =
  | (ModalComponentConfig<D, R> & { component: Type<C> })
  | (ModalTemplateConfig<C, D, R> & { template: TemplateRef<C> })
