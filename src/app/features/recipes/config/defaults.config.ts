import { SortOrder } from '@core/api/params'

export interface RecipeCatalogConfig {
  viewMode: 'pagination' | 'lazy'
  defaultSortBy: string
  defaultSortOrder: SortOrder
  defaultPageSize: number
}

export const DEFAULT_RECIPE_CATALOG_CONFIG: RecipeCatalogConfig = {
  viewMode: 'lazy',
  defaultSortBy: 'name',
  defaultSortOrder: 'asc',
  defaultPageSize: 4
}
