export interface ChipGroupItem<T extends string | number = string> {
  id: T
  label: string
  icon?: string
  disabled?: boolean
}
