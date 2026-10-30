import { type RecipeCatalogFilterChip } from '@features/recipes/ui/recipe-catalog-filter-bar'

export const COOKING_TIME_CHIPS: RecipeCatalogFilterChip[] = [
  {
    id: 'max-15',
    label: 'До 15 минут',
    range: { to: 15 }
  },
  {
    id: 'max-30',
    label: 'До 30 минут',
    range: { to: 30 }
  },
  {
    id: 'max-45',
    label: 'До 45 минут',
    range: { to: 45 }
  },
  {
    id: 'max-60',
    label: 'До часа',
    range: { to: 60 }
  },
  {
    id: 'over-60',
    label: 'Более часа',
    range: { from: 60 }
  }
]
