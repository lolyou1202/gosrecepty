import { DropdownInputItem } from '../dropdown-input/dropdown-input.model'

export interface FilterChip {
  label: string
  name: string
}

export type FilterConfigType =
  | 'input'
  //| 'search'
  | 'select'
//| 'radio'
//| 'checkbox'
//| 'checkbox-group'

export interface FilterConfigSelectOption {
  label: string
  name: string
}

export interface FilterConfigBase {
  name: string
  hide: boolean
  fieldLabel?: string
}

export type FilterConfigValidationOptions<T> = {
  value: T
  errorMessage?: string
}

export interface FilterConfigInput extends FilterConfigBase {
  type: Extract<FilterConfigType, 'input'>
  hint?: string
  minLength?: FilterConfigValidationOptions<number>
  maxLength?: FilterConfigValidationOptions<number>
  pattern?: Required<FilterConfigValidationOptions<string>>
}

export interface FilterConfigDropdownInput extends FilterConfigBase {
  type: Extract<FilterConfigType, 'select'>
  items: DropdownInputItem[]
  multiple?: boolean
  showChips?: boolean
  maxVisibleChips?: number
  placeholder?: string
}

export type FilterConfig = FilterConfigInput | FilterConfigDropdownInput

export type FilterStateValue = null | boolean | string | string[]

export interface FilterState {
  [name: string]: FilterStateValue
}
