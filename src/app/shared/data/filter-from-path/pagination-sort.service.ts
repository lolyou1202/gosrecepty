import { Injectable, computed, inject, InjectionToken } from '@angular/core'
import { QueryParamsService } from './query-params.service'

export interface PaginationSortConfig {
  defaultPageSize: number
  allowedSortBy: readonly string[]
  defaultSortBy: string
}

export type SortOrder = 'asc' | 'desc'

export const PAGINATION_SORT_CONFIG = new InjectionToken<PaginationSortConfig>(
  'PAGINATION_SORT_CONFIG'
)

@Injectable()
export class PaginationSortService {
  private readonly _qp = inject(QueryParamsService)
  private readonly _config = inject(PAGINATION_SORT_CONFIG)

  public readonly currentPage = computed(
    () => this._qp.readNumber('currentPage') ?? 1
  )

  public readonly pageSize = computed(
    () => this._qp.readNumber('pageSize') ?? this._config.defaultPageSize
  )

  public readonly sortBy = computed(
    () =>
      this._qp.readEnum('sortBy', this._config.allowedSortBy) ??
      this._config.defaultSortBy
  )

  public readonly sortOrder = computed<SortOrder>(() =>
    this._qp.read('sortOrder') === 'desc' ? 'desc' : 'asc'
  )

  public async setCurrentPage(page: number): Promise<void> {
    await this._qp.patch({ currentPage: page > 1 ? String(page) : null })
  }

  public async setPageSize(size: number): Promise<void> {
    await this._qp.patch({
      pageSize: size > 0 ? String(size) : null,
      currentPage: null
    })
  }

  public async setSortBy(by: string): Promise<void> {
    if (!this._config.allowedSortBy.includes(by)) return
    await this._qp.patch({ sortBy: by, currentPage: null })
  }

  public async setSortOrder(order: SortOrder): Promise<void> {
    await this._qp.patch({ sortOrder: order, currentPage: null })
  }
}
