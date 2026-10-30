import { type RecipeCatalogFilterChip } from '@features/recipes/ui/recipe-catalog-filter-bar'
import { type Nullable } from '@shared/utils/types/nullable'

export function findFilterChip(
  id: Nullable<RecipeCatalogFilterChip['id']>,
  chips: RecipeCatalogFilterChip[]
): Nullable<RecipeCatalogFilterChip> {
  if (!id) return null

  const chip = chips.find(c => c.id === id)

  return chip ?? null
}
