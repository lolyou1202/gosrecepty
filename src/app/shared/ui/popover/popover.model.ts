import { TemplateRef, Type } from '@angular/core'
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategyOrigin
} from '@angular/cdk/overlay'

export type PopoverCloseReason = 'outside' | 'escape' | 'programmatic'

export interface PopoverCloseEvent<R = unknown> {
  reason: PopoverCloseReason
  payload?: R
}

export interface PopoverBaseConfig<D = unknown> {
  origin: FlexibleConnectedPositionStrategyOrigin

  positions?: ConnectedPosition[]
  offset?: { x?: number; y?: number }

  width?: number | 'trigger' | 'auto'
  minWidth?: number
  maxWidth?: number
  maxHeight?: number

  data?: D

  scrollStrategy?: 'reposition' | 'block' | 'close' | 'noop'
  closeOnOutsideClick?: boolean
  closeOnEscape?: boolean

  backdropClass?: string | null
  panelClass?: string | string[]

  ariaRole?: 'dialog' | 'menu' | 'listbox' | 'tooltip' | 'region'
  ariaLabel?: string

  autoFocus?: boolean
  restoreFocus?: boolean
  disableAnimation?: boolean
}

export interface PopoverComponentConfig<
  D = unknown
> extends PopoverBaseConfig<D> {
  componentInputs?: Record<string, unknown>
}

export interface PopoverTemplateConfig<
  C = unknown,
  D = unknown
> extends PopoverBaseConfig<D> {
  templateContext?: C
}

export type PopoverConfig<C = unknown, D = unknown> =
  | (PopoverComponentConfig<D> & { component: Type<unknown> })
  | (PopoverTemplateConfig<C, D> & { template: TemplateRef<C> })
