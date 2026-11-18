import { FilterDefinition } from '@features/recipes/models/filter-definition.model'

export const CATEGORIES_FILTER = {
  type: 'text',
  key: 'categories',
  label: 'Категории',
  options: [
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
} as const satisfies FilterDefinition
