import { computed, inject, Injectable, linkedSignal } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { RecipeApiService } from './recipe-api.service'
import { RecipeListFilterService } from './recipe-list-filter.service'
import { PagingMeta } from '@core/api/api-base.model'
import { RecipeCard } from '../model/recipe.model'

@Injectable()
export class RecipeListService {
  private readonly _api = inject(RecipeApiService)
  private readonly _filter = inject(RecipeListFilterService)

  private readonly _response = rxResource({
    params: () => this._filter.request(),
    stream: ({ params }) => this._api.getRecipes(params)
  })

  private readonly _meta = linkedSignal({
    source: () => ({
      value: this._response.value()?.meta,
      status: this._response.status()
    }),
    computation: (source, prev): PagingMeta | undefined => {
      if (source.status === 'loading' || source.status === 'reloading') {
        return prev?.value
      }
      if (source.status === 'error') {
        return undefined
      }
      return source.value
    }
  })

  private readonly _items = linkedSignal({
    source: () => this._response.value()?.items,
    computation: (newItems, prev): RecipeCard[] => {
      if (!newItems) return prev?.value ?? []

      if (
        this._filter.viewMode() === 'pagination' ||
        this._filter.currentPage() === 1
      ) {
        return newItems
      }

      return [...(prev?.value ?? []), ...newItems]
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
