import { Injectable, computed, inject, signal } from '@angular/core'
import { QueryParamsService } from '@shared/data/filter-from-path/query-params.service'
import { PaginationSortService } from '@shared/data/filter-from-path/pagination-sort.service'

@Injectable()
export class RecipeListFilterService {
  private readonly _qp = inject(QueryParamsService)
  private readonly _paginationSort = inject(PaginationSortService)

  public readonly pageSize = this._paginationSort.pageSize
  public readonly sortBy = this._paginationSort.sortBy
  public readonly sortOrder = this._paginationSort.sortOrder
  public readonly setPageSize = this._paginationSort.setPageSize
  public readonly setSortBy = this._paginationSort.setSortBy
  public readonly setSortOrder = this._paginationSort.setSortOrder

  private readonly _lazyPage = signal(1)

  public readonly viewMode = computed<'pagination' | 'lazy'>(() =>
    this._qp.read('view') === 'lazy' ? 'lazy' : 'pagination'
  )

  public readonly currentPage = computed(() => {
    if (this.viewMode() === 'lazy') {
      return this._lazyPage()
    }
    return this._paginationSort.currentPage()
  })

  public readonly category = computed(() => this._qp.read('category'))

  public async setCurrentPage(page: number): Promise<void> {
    if (this.viewMode() === 'lazy') {
      this._lazyPage.set(page)
    } else {
      await this._paginationSort.setCurrentPage(page)
    }
  }

  public async setViewMode(mode: 'pagination' | 'lazy'): Promise<void> {
    await this._qp.patch({
      view: mode === 'lazy' ? 'lazy' : null,
      currentPage: null
    })
    this._lazyPage.set(1)
  }

  public async setCategory(id: string | null): Promise<void> {
    await this._qp.patch({
      category: id,
      currentPage: null
    })
    this._lazyPage.set(1)
  }

  public readonly request = computed(() => ({
    category: this.category(),
    page: this.currentPage(),
    limit: this.pageSize(),
    sortBy: this.sortBy(),
    sortOrder: this.sortOrder()
  }))
}
