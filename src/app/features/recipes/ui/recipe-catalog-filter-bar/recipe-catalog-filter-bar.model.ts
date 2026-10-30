import { ApiRange } from '@core/api/params'
import { ChipGroupItem } from '@shared/ui/chip-group'

export interface RecipeCatalogFilterChip extends ChipGroupItem {
  range?: ApiRange
}

export interface RecipeCatalogFilterForm {
  name: string
  cookingTime: string[]
  calories: string[]
}
