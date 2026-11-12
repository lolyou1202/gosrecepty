import { ModalBaseConfig } from './modal-base-config.model'

export interface ModalComponentConfig<D = unknown> extends ModalBaseConfig<D> {
  componentInputs?: Record<string, unknown>
}
