import { computed, inject, Injectable, linkedSignal } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { type PagingMeta } from '@core/api/paging'
import { type Nullable } from '@shared/utils/types'
import { RecipeApiService } from './recipe-api.service'
import { RecipeCatalogFilterService } from './recipe-catalog-filter.service'
import { type RecipeCard, type RecipesRequestParams } from '../models'
import { RecipeCatalogConfigService } from '../config'

@Injectable()
export class RecipeCatalogService {
  private readonly _api = inject(RecipeApiService)
  private readonly _filter = inject(RecipeCatalogFilterService)
  private readonly _config = inject(RecipeCatalogConfigService)

  public readonly request = computed<RecipesRequestParams>(() => ({
    category: this._filter.category(),
    name: this._filter.name(),
    cookingTime: this._filter.cookingTime(),
    calories: this._filter.calories(),
    page: this._filter.currentPage(),
    limit: this._filter.pageSize(),
    sortBy: this._filter.sortBy(),
    sortOrder: this._filter.sortOrder()
  }))

  private readonly _response = rxResource({
    params: () => this.request(),
    stream: ({ params }) => this._api.getRecipes(params)
  })

  private readonly _meta = linkedSignal({
    source: () => ({
      value: this._response.value()?.meta,
      status: this._response.status()
    }),
    computation: (source, prev): Nullable<PagingMeta> => {
      if (source.status === 'loading' || source.status === 'reloading') {
        return prev?.value
      }
      if (source.status === 'error') {
        return prev?.value
      }
      return source.value
    }
  })

  private readonly _items = linkedSignal({
    source: () => ({
      items: this._response.value()?.items
    }),
    computation: (source, prev): RecipeCard[] => {
      if (!source.items) {
        return prev?.value ?? []
      }

      if (
        this._config.viewMode() === 'pagination' ||
        this._filter.currentPage() === 1
      ) {
        return source.items
      }

      return [...(prev?.value ?? []), ...source.items]
    }
  })

  public readonly items = this._items.asReadonly()

  public readonly totalItems = computed(() => this._meta()?.totalItems ?? 0)

  public readonly totalPages = computed(() => this._meta()?.totalPages ?? 0)

  public readonly hasMore = computed(
    () => (this._meta()?.remainingCount ?? 0) > 0
  )

  public readonly filter = this._filter
  public readonly status = this._response.status
  public readonly loading = this._response.isLoading
  public readonly error = this._response.error
}
