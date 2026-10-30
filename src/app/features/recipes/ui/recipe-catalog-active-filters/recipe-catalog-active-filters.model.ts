import type { FilterPatch } from '@features/recipes/models'

export type RecipeCatalogActiveFilterKey = keyof FilterPatch

export interface RecipeCatalogActiveFilterPill {
  key: RecipeCatalogActiveFilterKey
  label: string
}
