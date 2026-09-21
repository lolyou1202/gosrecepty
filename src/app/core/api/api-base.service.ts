import { HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { API_BASE_URL } from '../config/tokens'
import { ApiOptions } from './api-base.model'

@Injectable({ providedIn: 'root' })
export class ApiBaseService {
  private readonly _apiBaseUrl = inject(API_BASE_URL)

  public readonly url = this._apiBaseUrl

  public buildApiOptions({
    select,
    search,
    filters,
    page = 0,
    limit = 20,
    sortBy,
    sortOrder = 'asc'
  }: ApiOptions): HttpParams {
    let params = new HttpParams()

    if (select && select.length > 0) {
      params = params.set('_select', select.join(','))
    }

    if (search && search.length > 0) {
      search.forEach(search => {
        params = params.set(search.field, `*${search.value}*`)
      })
    }

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === null) continue
        if (Array.isArray(value)) {
          value.forEach(item => {
            params = params.append(`${key}[]`, String(item))
          })
        } else {
          params = params.set(key, String(value))
        }
      }
    }

    params = params.set('page', String(page))
    params = params.set('limit', String(limit))

    if (sortBy) {
      const sortField = sortOrder === 'desc' ? `-${sortBy}` : sortBy
      params = params.set('sortBy', sortField)
    }

    return params
  }
}
