import { Signal } from '@angular/core'
import { DefaultButtonStyleVariant } from '@shared/ui/default-button'

export interface ModalAction {
  variant: DefaultButtonStyleVariant
  text: string
  disabled?: boolean | Signal<boolean>
  closeOnClick?: boolean
  onClick?: () => void | Promise<void>
}
