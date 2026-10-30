import { type RecipeCatalogFilterChip } from '@features/recipes/ui/recipe-catalog-filter-bar'

export const CALORIES_CHIPS: RecipeCatalogFilterChip[] = [
  {
    id: 'max-200',
    label: 'До 200 кКал',
    range: { to: 200 }
  },
  {
    id: '200-400',
    label: '200-400 кКал',
    range: { from: 200, to: 400 }
  },
  {
    id: '400-600',
    label: '400-600 кКал',
    range: { from: 400, to: 600 }
  },
  {
    id: '600-800',
    label: '600-800 кКал',
    range: { from: 600, to: 800 }
  },
  {
    id: 'over-800',
    label: 'Более 800 кКал',
    range: { from: 800 }
  }
]
