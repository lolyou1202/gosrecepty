import { HttpParams } from '@angular/common/http'
import { SortOrder } from './params.model'

/**
 * Строит параметр сортировки. `desc` → префикс `-`.
 * Результат: `sortBy=name` или `sortBy=-dateCreated`
 */
export const buildSortApiParams = (
  sortBy?: string,
  sortOrder: SortOrder = 'asc',
  params: HttpParams = new HttpParams()
): HttpParams => {
  if (!sortBy) {
    return params
  }

  const field = sortOrder === 'desc' ? `-${sortBy}` : sortBy

  return params.set('sortBy', field)
}
