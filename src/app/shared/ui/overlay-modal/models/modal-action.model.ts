import { Signal } from '@angular/core'
import { DefaultButtonStyleVariant } from '@shared/ui/default-button'

export interface ModalAction<R = unknown, D = unknown> {
  variant: DefaultButtonStyleVariant
  text: string
  disabled?: boolean | Signal<boolean>
  closeOnClick?: boolean
  onClick?: (ctx: D) => R | Promise<R> | void | Promise<void>
}
