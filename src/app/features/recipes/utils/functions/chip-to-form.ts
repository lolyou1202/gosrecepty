import type { RecipeCatalogFilterChip } from '@features/recipes/models'
import type { Nullable } from '@shared/utils/types/nullable'
import { findFilterChip } from './find-filter-chip'

export function chipToForm(
  chips: RecipeCatalogFilterChip[],
  id: Nullable<RecipeCatalogFilterChip['id']>
): RecipeCatalogFilterChip['id'][] {
  const chip = findFilterChip(id, chips)
  return chip ? [chip.id] : []
}
