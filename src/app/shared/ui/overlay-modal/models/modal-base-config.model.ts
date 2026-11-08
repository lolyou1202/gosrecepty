import { ModalAction } from './modal-action.model'

export interface ModalBaseConfig<D = unknown, R = unknown> {
  title?: string
  data?: D
  actions?: ModalAction<R, D>[]
}
