import { HttpParams } from '@angular/common/http'

/**
 * Строит параметры поиска (полнотекстовый, обёртка `*…*`).
 * Результат: `name=*борщ*&description=*суп*`
 */
export const buildSearchApiParams = (
  search?: Record<string, string>,
  params: HttpParams = new HttpParams()
): HttpParams => {
  if (!search || Object.keys(search).length === 0) {
    return params
  }

  let result = params
  for (const [key, value] of Object.entries(search)) {
    result = result.set(key, `*${value}*`)
  }
	
  return result
}
