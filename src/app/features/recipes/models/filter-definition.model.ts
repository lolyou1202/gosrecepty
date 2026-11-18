import { FilterOption } from './filter-option.model'

export interface FilterDefinition {
  type: 'text' | 'range'
  key: string
  label: string
	pillLabel?: string
  options?: FilterOption[]
}
