import { PopupBaseConfig } from './popup-base-config.model'

export interface PopupComponentConfig<D = unknown> extends PopupBaseConfig<D> {
  componentInputs?: Record<string, unknown>
}
