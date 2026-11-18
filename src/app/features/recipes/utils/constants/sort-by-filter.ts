import { FilterDefinition } from '@features/recipes/models'

export const SORT_BY_FILTER = {
  type: 'text',
  key: 'sortBy',
  label: 'Сортировать по',
  options: [
    { id: 'name', label: 'По названию' },
    { id: 'calories', label: 'По калориям' },
    { id: 'cookingTime', label: 'По времени' }
  ]
} as const satisfies FilterDefinition
