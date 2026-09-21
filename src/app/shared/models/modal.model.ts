import { ButtonDefaultVariant } from '../ui/button-default/button-default.model'
import { OverlayBaseConfig } from './overlay.model'

export interface ModalConfig extends OverlayBaseConfig {
  title: string
  actions?: ModalAction[]
  actionsJustify?: 'start' | 'center' | 'end' | 'between'
}

export interface ModalAction {
  variant: ButtonDefaultVariant
  text: string
  disabled?: boolean
  onClick?: () => void
}
