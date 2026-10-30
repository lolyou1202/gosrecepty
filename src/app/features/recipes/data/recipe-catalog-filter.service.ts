import { Injectable, computed, effect, inject, signal } from '@angular/core'
import { type SortOrder } from '@core/api/params'
import { QueryParamsService } from '@shared/services/query-params.service'
import { type Nullable } from '@shared/utils/types'
import { type FilterPatch } from '../models'
import {
  RecipeCatalogConfigService,
  DEFAULT_RECIPE_CATALOG_CONFIG
} from '../config'

@Injectable()
export class RecipeCatalogFilterService {
  private readonly _qp = inject(QueryParamsService)
  private readonly _config = inject(RecipeCatalogConfigService)

  private readonly _lazyPage = signal(1)

  constructor() {
    effect(async () => {
      void this._config.viewMode()
      this._lazyPage.set(1)
      await this._qp.patch({ currentPage: null })
    })
  }

  public readonly currentPage = computed(() => {
    if (this._config.viewMode() === 'lazy') {
      return this._lazyPage()
    }
    return this._qp.readNumber('currentPage') ?? 1
  })

  public async setCurrentPage(page: number): Promise<void> {
    if (this._config.viewMode() === 'lazy') {
      this._lazyPage.set(page)
    } else {
      await this._qp.patch({
        currentPage: page > 1 ? String(page) : null
      })
    }
  }

  public readonly pageSize = computed(
    () =>
      this._qp.readNumber('pageSize') ??
      DEFAULT_RECIPE_CATALOG_CONFIG.defaultPageSize
  )

  public async setPageSize(size: number): Promise<void> {
    await this._qp.patch({
      pageSize: size > 0 ? String(size) : null,
      currentPage: null
    })
    this._lazyPage.set(1)
  }

  public readonly sortBy = computed(
    () => this._qp.read('sortBy') ?? DEFAULT_RECIPE_CATALOG_CONFIG.defaultSortBy
  )

  public async setSortBy(sortBy: string): Promise<void> {
    await this._qp.patch({
      sortBy,
      currentPage: null
    })
    this._lazyPage.set(1)
  }

  public readonly sortOrder = computed<SortOrder>(() => {
    const value = this._qp.read('sortOrder')
    if (value === 'desc' || value === 'asc') {
      return value
    }
    return DEFAULT_RECIPE_CATALOG_CONFIG.defaultSortOrder
  })

  public async setSortOrder(sortOrder: SortOrder): Promise<void> {
    await this._qp.patch({
      sortOrder,
      currentPage: null
    })
    this._lazyPage.set(1)
  }

  public readonly category = computed(() => this._qp.read('category'))

  public async setCategory(category: Nullable<string>): Promise<void> {
    await this._qp.patch({
      category,
      currentPage: null
    })
    this._lazyPage.set(1)
  }

  public readonly name = computed(() => this._qp.read('name'))

  public readonly cookingTime = computed(() => {
    return this._qp.read('cookingTime')
  })

  public readonly calories = computed(() => {
    return this._qp.read('calories')
  })

  public async patchFilters(patch: FilterPatch): Promise<void> {
    await this._qp.patch({
      ...patch,
      currentPage: null
    })
    this._lazyPage.set(1)
  }

  public readonly hasActiveFilters = computed(
    () =>
      this.name() !== null ||
      this.cookingTime() !== null ||
      this.calories() !== null
  )

  public async removeFilter(key: keyof FilterPatch): Promise<void> {
    await this.patchFilters({ [key]: null })
  }

  public async clearAllFilters(): Promise<void> {
    await this.patchFilters({
      name: null,
      cookingTime: null,
      calories: null
    })
  }
}
