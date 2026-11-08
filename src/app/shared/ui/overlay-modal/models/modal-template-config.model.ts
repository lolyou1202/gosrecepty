import { ModalBaseConfig } from "./modal-base-config.model";

export interface ModalTemplateConfig<
  C = unknown,
  D = unknown,
  R = unknown
> extends ModalBaseConfig<D, R> {
  templateContext?: C
}
