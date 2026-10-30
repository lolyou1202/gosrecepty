import { InputSignal } from '@angular/core'

export type ExtractInputValue<T> = T extends InputSignal<infer U> ? U : never

export type ComponentInputValues<T> = {
  [K in keyof T]?: ExtractInputValue<T[K]>
}
