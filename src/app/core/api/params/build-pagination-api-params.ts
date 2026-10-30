import { HttpParams } from '@angular/common/http'

/**
 * Строит параметры пагинации со значениями по умолчанию.
 * Результат: `page=1&limit=20`
 */
export const buildPaginationParams = (
  page: number = 1,
  limit: number = 20,
  params: HttpParams = new HttpParams()
): HttpParams => {
  return params.set('page', String(page)).set('limit', String(limit))
}
