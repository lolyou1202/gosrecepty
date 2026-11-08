export type ModalResult<R = unknown> =
  | {
      action: 'close'
    }
  | {
      action: 'action'
      text: string
      payload?: R
    }
