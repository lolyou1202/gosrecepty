import { HttpParams } from '@angular/common/http'

/**
 * Строит параметр `_select` из списка полей.
 * Результат: `_select=id,name,image`
 */
export const buildSelectApiParams = (
  select?: readonly string[],
  params: HttpParams = new HttpParams()
): HttpParams => {
  if (!select?.length) {
    return params
  }
	
  return params.set('_select', select.join(','))
}
