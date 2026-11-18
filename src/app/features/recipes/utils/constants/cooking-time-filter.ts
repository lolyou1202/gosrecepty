import { FilterDefinition } from '@features/recipes/models/filter-definition.model'

export const COOKING_TIME_FILTER = {
  type: 'range',
  key: 'cookingTime',
  label: 'Время приготовления',
  pillLabel: 'Время приготовления',
  options: [
    { id: 'max-15', label: 'До 15 минут', range: { to: 15 } },
    { id: 'max-30', label: 'До 30 минут', range: { to: 30 } },
    { id: 'max-45', label: 'До 45 минут', range: { to: 45 } },
    { id: 'max-60', label: 'До часа', range: { to: 60 } },
    { id: 'over-60', label: 'Более часа', range: { from: 60 } }
  ]
} as const satisfies FilterDefinition
