import { FilterDefinition } from '@features/recipes/models/filter-definition.model'

export const NAME_FILTER = {
  type: 'text',
  key: 'name',
  label: 'Поиск по названию',
	pillLabel: 'Название',
} as const satisfies FilterDefinition
