import { InjectionToken } from '@angular/core'

export interface FilterConfig {
  defaultPageSize: number
  allowedSortBy: readonly string[]
  defaultSortBy: string
  pathPrefix?: string
}

export const FILTER_FROM_PATH_CONFIG = new InjectionToken<FilterConfig>(
  'FILTER_FROM_PATH_CONFIG',
  {
    factory: (): FilterConfig => ({
      defaultPageSize: 10,
      allowedSortBy: ['id'],
      defaultSortBy: 'id'
    })
  }
)
