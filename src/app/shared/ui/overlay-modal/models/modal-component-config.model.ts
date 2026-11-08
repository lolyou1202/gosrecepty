import { ModalBaseConfig } from './modal-base-config.model'

export interface ModalComponentConfig<
  D = unknown,
  R = unknown
> extends ModalBaseConfig<D, R> {
  componentInputs?: Record<string, unknown>
}
