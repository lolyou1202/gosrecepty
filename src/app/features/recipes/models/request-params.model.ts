import { SortOrder } from '@core/api/params'
import { Nullable } from '@shared/utils/types/nullable'
import { FilterOption } from './filter-option.model'

export interface RequestParams {
  category: Nullable<FilterOption>
  name: Nullable<string>
  cookingTime: Nullable<FilterOption>
  calories: Nullable<FilterOption>
  page: number
  limit: number
  sortBy: string
  sortOrder: SortOrder
}
