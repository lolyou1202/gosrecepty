import { Injectable, inject, computed, InjectionToken } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { toSignal } from '@angular/core/rxjs-interop'
import { readStringParam } from '../../utils/functions/read-string-param'
import { isOneOf } from '../../utils/guards/is-one-of-string-array'
import { parseArrayFromString } from '../../utils/functions/parse-array-from-string'
import { SortOrder } from '../../core/api/api-base.model'

export interface FilterConfig {
  defaultPageSize: number
  allowedSortBy: string[]
  defaultSortBy: string
  tagsSeparator?: string
  pathPrefix?: string
}

export const FILTER_FROM_PATH_CONFIG = new InjectionToken<FilterConfig>(
  'FILTER_FROM_PATH_CONFIG',
  {
    factory: (): FilterConfig => ({
      defaultPageSize: 10,
      allowedSortBy: ['id'],
      defaultSortBy: 'id',
      pathPrefix: 'filter'
    })
  }
)

@Injectable()
export class FilterFromPathService {
  private readonly _route = inject(ActivatedRoute)
  private readonly _router = inject(Router)
  private readonly _config = inject(FILTER_FROM_PATH_CONFIG)

  private readonly _queryParams = toSignal(this._route.queryParams)

  public readonly search = computed(() => {
    const params = this._queryParams()
    const key = this._pathKey('search')
    const search = readStringParam(key, params)
    return search && search.length >= 2 ? search : ''
  })

  public readonly currentPage = computed(() => {
    const params = this._queryParams()
    const key = this._pathKey('currentPage')
    const currentPage = Number(readStringParam(key, params))
    return currentPage > 0 ? currentPage : 1
  })

  public readonly pageSize = computed(() => {
    const params = this._queryParams()
    const key = this._pathKey('pageSize')
    const pageSize = Number(readStringParam(key, params))
    return pageSize > 0 ? pageSize : this._config.defaultPageSize
  })

  public readonly sortBy = computed(() => {
    const params = this._queryParams()
    const key = this._pathKey('sortBy')
    const sortBy = readStringParam(key, params)
    return isOneOf(sortBy, this._config.allowedSortBy)
      ? sortBy
      : this._config.defaultSortBy
  })

  public readonly sortOrder = computed(() => {
    const params = this._queryParams()
    const key = this._pathKey('sortOrder')
    const sortOrder = readStringParam(key, params)
    return sortOrder === 'desc' ? 'desc' : 'asc'
  })

  public readonly tags = computed(() => {
    const params = this._queryParams()
    const key = this._pathKey('tags')
    const tags = readStringParam(key, params)
    return parseArrayFromString(tags, ',')
  })

  public async setSearch(newSearch: string): Promise<void> {
    const key = this._pathKey('search')
    const value = newSearch || null
    await this._updateParams({ [key]: value })
  }

  public async setCurrentPage(newPage: number): Promise<void> {
    const key = this._pathKey('currentPage')
    const value = newPage > 1 ? String(newPage) : null
    await this._updateParams({ [key]: value })
  }

  public async setPageSize(newPageSize: number): Promise<void> {
    const key = this._pathKey('pageSize')
    const value = newPageSize > 0 ? String(newPageSize) : null
    await this._updateParams({ [key]: value })
  }

  public async setSortBy(newSortBy: string): Promise<void> {
    const keySortBy = this._pathKey('sortBy')
    const allowedSortBy = this._config.allowedSortBy
    if (allowedSortBy.includes(newSortBy)) {
      await this._updateParams({ [keySortBy]: newSortBy })
    }
  }

  public async setSortOrder(newSortOrder: SortOrder): Promise<void> {
    const keySortOrder = this._pathKey('sortOrder')
    await this._updateParams({ [keySortOrder]: newSortOrder })
  }

  private _pathKey(name: string): string {
    return `${this._config.pathPrefix}_${name}`
  }

  private async _updateParams(
    params: Record<string, string | null>
  ): Promise<boolean> {
    return this._router.navigate([], {
      relativeTo: this._route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true
    })
  }
}
