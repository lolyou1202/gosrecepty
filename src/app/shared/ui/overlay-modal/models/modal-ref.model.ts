import { ModalResult } from './modal-result.model'

export interface ModalRef<R = unknown> {
  close(result?: ModalResult<R>): void
}
