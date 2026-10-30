import { SortOrder } from '@core/api/params'
import { Nullable } from '@shared/utils/types/nullable'

export interface RecipesRequestParams {
  category: Nullable<string>
  name: Nullable<string>
  cookingTime: Nullable<string>
  calories: Nullable<string>
  page: number
  limit: number
  sortBy: string
  sortOrder: SortOrder
}
