import { HttpParams } from '@angular/common/http'
import { ApiRange } from './params.model'

/**
 * Строит параметры-диапазоны.
 * Результат: `cookingTime[from]=15&cookingTime[to]=30`
 */
export const buildRangesParams = (
  ranges?: Record<string, ApiRange>,
  params: HttpParams = new HttpParams()
): HttpParams => {
  if (!ranges) {
    return params
  }

  let result = params
  for (const [key, range] of Object.entries(ranges)) {
    if (range.from !== undefined && range.from !== null) {
      result = result.set(`${key}[from]`, String(range.from))
    }
    if (range.to !== undefined && range.to !== null) {
      result = result.set(`${key}[to]`, String(range.to))
    }
  }

  return result
}
