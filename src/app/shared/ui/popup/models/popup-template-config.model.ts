import { PopupBaseConfig } from './popup-base-config.model'

export interface PopupTemplateConfig<
  C = unknown,
  D = unknown
> extends PopupBaseConfig<D> {
  templateContext?: C
}
