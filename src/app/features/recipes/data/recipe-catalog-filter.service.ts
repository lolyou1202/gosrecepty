import { Injectable, computed, inject, signal } from '@angular/core'
import { skip } from 'rxjs'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { type SortOrder } from '@core/api/params'
import { QueryParamsService } from '@shared/services/query-params.service'
import { findById } from '@shared/utils/functions/find-by-id'
import { type Nullable } from '@shared/utils/types'
import {
  RecipeCatalogConfigService,
  DEFAULT_RECIPE_CATALOG_CONFIG
} from '../config'
import { type FilterPatch, FilterOption } from '../models'
import {
  CALORIES_FILTER,
  CATEGORIES_FILTER,
  COOKING_TIME_FILTER,
  NAME_FILTER,
  SORT_BY_FILTER,
  SORT_ORDER_FILTER
} from '../utils/constants'

@Injectable()
export class RecipeCatalogFilterService {
  private readonly _qp = inject(QueryParamsService)
  private readonly _config = inject(RecipeCatalogConfigService)

  private readonly _lazyPage = signal(1)

  constructor() {
    toObservable(this._config.viewMode)
      .pipe(skip(1), takeUntilDestroyed())
      .subscribe(() => {
        this._lazyPage.set(1)
        void this._qp.patch({ currentPage: null })
      })
  }

  public readonly currentPage = computed(() => {
    if (this._config.viewMode() === 'lazy') {
      return this._lazyPage()
    }
    return this._qp.readNumber('currentPage') ?? 1
  })

  public readonly pageSize = computed(
    () =>
      this._qp.readNumber('pageSize') ??
      DEFAULT_RECIPE_CATALOG_CONFIG.defaultPageSize
  )

  public readonly sortBy = computed(() => {
    const query = this._qp.read('sortBy')
    if (!query) {
      return DEFAULT_RECIPE_CATALOG_CONFIG.defaultSortBy
    }
    const option = findById(SORT_BY_FILTER.options, query)
    return option ? option.id : DEFAULT_RECIPE_CATALOG_CONFIG.defaultSortBy
  })

  public readonly sortOrder = computed<SortOrder>(() => {
    const query = this._qp.read('sortOrder')
    if (!query) {
      return DEFAULT_RECIPE_CATALOG_CONFIG.defaultSortOrder
    }
    const option = findById(SORT_ORDER_FILTER.options, query)
    return option ? option.id : DEFAULT_RECIPE_CATALOG_CONFIG.defaultSortOrder
  })

  public readonly category = computed<Nullable<FilterOption>>(() => {
    const query = this._qp.read('category')
    if (!query) return null
    return findById(CATEGORIES_FILTER.options, query)
  })

  public readonly name = computed<Nullable<string>>(() => this._qp.read('name'))

  public readonly cookingTime = computed<Nullable<FilterOption>>(() => {
    const query = this._qp.read('cookingTime')
    if (!query) return null
    return findById(COOKING_TIME_FILTER.options, query)
  })

  public readonly calories = computed<Nullable<FilterOption>>(() => {
    const query = this._qp.read('calories')
    if (!query) return null
    return findById(CALORIES_FILTER.options, query)
  })

  public readonly hasActiveFilters = computed(
    () =>
      this.name() !== null ||
      this.cookingTime() !== null ||
      this.calories() !== null
  )

  public readonly pills = computed(() => {
    const result: { key: keyof FilterPatch; label: string; value: string }[] =
      []

    const name = this.name()
    if (name) {
      result.push({
        key: NAME_FILTER.key,
        label: NAME_FILTER.pillLabel,
        value: name
      })
    }

    const cookingTime = this.cookingTime()
    if (cookingTime) {
      result.push({
        key: COOKING_TIME_FILTER.key,
        label: COOKING_TIME_FILTER.pillLabel,
        value: cookingTime.label
      })
    }

    const calories = this.calories()
    if (calories) {
      result.push({
        key: CALORIES_FILTER.key,
        label: CALORIES_FILTER.pillLabel,
        value: calories.label
      })
    }

    return result
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

  public async setPageSize(size: number): Promise<void> {
    await this._qp.patch({
      pageSize: size > 0 ? String(size) : null,
      currentPage: null
    })
    this._lazyPage.set(1)
  }

  public async setSortBy(sortBy: string): Promise<void> {
    await this._qp.patch({
      sortBy,
      currentPage: null
    })
    this._lazyPage.set(1)
  }

  public async setSortOrder(sortOrder: SortOrder): Promise<void> {
    await this._qp.patch({
      sortOrder,
      currentPage: null
    })
    this._lazyPage.set(1)
  }

  public async setCategory(category: Nullable<string>): Promise<void> {
    await this._qp.patch({
      category,
      currentPage: null
    })
    this._lazyPage.set(1)
  }

  public async patchFilters(patch: FilterPatch): Promise<void> {
    await this._qp.patch({
      ...patch,
      currentPage: null
    })
    this._lazyPage.set(1)
  }

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
