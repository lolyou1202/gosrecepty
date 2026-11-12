import type { RecipeCatalogFilterChip } from '@features/recipes/models'

export const CATEGORIES_CHIPS: RecipeCatalogFilterChip[] = [
  { id: 'all', label: 'Все категории' },
  { id: 'breakfast', label: 'Завтраки' },
  { id: 'desserts', label: 'Десерты' },
  { id: 'salads', label: 'Салаты' },
  { id: 'appetizers', label: 'Закуски' },
  { id: 'sides', label: 'Гарниры и овощи' },
  { id: 'pasta', label: 'Паста' },
  { id: 'soups', label: 'Супы' },
  { id: 'meat', label: 'Мясные блюда' },
  { id: 'poultry', label: 'Птица' },
  { id: 'fish', label: 'Рыба и морепродукты' },
  { id: 'drinks', label: 'Напитки' }
]
