import { ModalBaseConfig } from './modal-base-config.model'

export interface ModalTemplateConfig<
  C = unknown,
  D = unknown
> extends ModalBaseConfig<D> {
  templateContext?: C
}
