import { findFilterChip } from './find-filter-chip'
import { type RecipeCatalogFilterChip } from '@features/recipes/ui/recipe-catalog-filter-bar'
import { type Nullable } from '@shared/utils/types/nullable'

export function chipToForm(
  chips: RecipeCatalogFilterChip[],
  id: Nullable<RecipeCatalogFilterChip['id']>
): RecipeCatalogFilterChip['id'][] {
  const chip = findFilterChip(id, chips)
  return chip ? [chip.id] : []
}
