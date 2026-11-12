import { ModalAction } from './modal-action.model'

export interface ModalBaseConfig<D = unknown> {
  title?: string
  data?: D
  actions?: ModalAction[]
}
