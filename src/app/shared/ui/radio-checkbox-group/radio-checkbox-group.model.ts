export interface RadioCheckboxOption<T extends string | number> {
  readonly id: T
  readonly label: string
  readonly disabled?: boolean
}

export type RadioCheckboxOrientation = 'vertical' | 'horizontal'
