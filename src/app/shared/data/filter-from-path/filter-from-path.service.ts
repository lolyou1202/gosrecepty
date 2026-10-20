import { Injectable, inject, computed } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { toSignal } from '@angular/core/rxjs-interop'
import { readStringParam } from '../../../utils/functions/read-string-param'
import { isOneOf } from '../../../utils/guards/is-one-of-string-array'
import { SortOrder } from '../../../core/api/api-base.model'
import { FILTER_FROM_PATH_CONFIG } from './filter-from-path.config'

@Injectable()
export class FilterFromPathService {
  private readonly _route = inject(ActivatedRoute)
  private readonly _router = inject(Router)
  private readonly _config = inject(FILTER_FROM_PATH_CONFIG)

  private readonly _queryParams = toSignal(this._route.queryParams, {
    initialValue: {}
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
    const prefix = this._config.pathPrefix
    return prefix ? `${prefix}_${name}` : name
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
