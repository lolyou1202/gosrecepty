import { FilterDefinition } from '@features/recipes/models'

export const SORT_ORDER_FILTER = {
  type: 'text',
  key: 'sortOrder',
  label: 'Направление',
  options: [
    { id: 'asc', label: 'По возрастанию' },
    { id: 'desc', label: 'По убыванию' }
  ]
} as const satisfies FilterDefinition
