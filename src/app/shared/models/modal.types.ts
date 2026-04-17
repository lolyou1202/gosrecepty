import {
  ButtonVariant,
  ButtonWidthVariant
} from '../components/button/button.model'
import { OverlayBaseConfig } from './overlay.types'

export interface ModalConfig extends OverlayBaseConfig {
  title: string
  actions?: ModalAction[]
  actionsJustify?: 'start' | 'center' | 'end' | 'between'
}

export interface ModalAction {
  variant: Exclude<ButtonVariant, 'transparent'>
  width?: ButtonWidthVariant
  text: string
  disabled?: boolean
  onClick?: () => void
}
