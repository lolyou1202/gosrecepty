import { FilterOptionRange } from './filter-option-range.model'

export interface FilterOption {
  id: string
  label: string
  range?: FilterOptionRange
}
