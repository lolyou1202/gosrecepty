import { HttpParams } from '@angular/common/http'

/**
 * Строит параметры точного совпадения.
 * Массивы → `key[]=v1&key[]=v2`. Скаляры → `key=v`.
 * `null`/`undefined` пропускаются.
 */
export const buildFiltersApiParams = (
  filters?: Record<string, unknown>,
  params: HttpParams = new HttpParams()
): HttpParams => {
  if (!filters) {
    return params
  }

  let result = params
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      for (const item of value) {
        result = result.append(`${key}[]`, String(item))
      }
    } else {
      result = result.set(key, String(value))
    }
  }
	
  return result
}
