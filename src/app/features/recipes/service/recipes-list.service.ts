import { inject, Injectable, signal } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import {
  asyncScheduler,
  catchError,
  combineLatest,
  debounceTime,
  of,
  switchMap,
  tap
} from 'rxjs'
import { RecipeApiService } from './recipe-api.service'
import { RecipeCard } from '../model/recipe.model'
import { FilterFromPathService } from '../../../shared/services/filter-from-path.service'
import { SortOrder } from '../../../core/api/api-base.model'

@Injectable({ providedIn: 'root' })
export class RecipeListService {
  private readonly _recipeApi = inject(RecipeApiService)
  private readonly _filterService = inject(FilterFromPathService)

  private readonly _recipes = signal<RecipeCard[]>([])
  private readonly _loading = signal(false)
  private readonly _error = signal<unknown>(null)
  private readonly _totalPages = signal<number | null>(null)
  private readonly _totalItems = signal<number | null>(null)

  public readonly search = this._filterService.search
  public readonly currentPage = this._filterService.currentPage
  public readonly pageSize = this._filterService.pageSize
  public readonly sortBy = this._filterService.sortBy
  public readonly sortOrder = this._filterService.sortOrder
  //public readonly tags = this._filterService.tags
  public readonly recipes = this._recipes.asReadonly()
  public readonly totalPages = this._totalPages.asReadonly()
  public readonly totalItems = this._totalItems.asReadonly()
  public readonly loading = this._loading.asReadonly()
  public readonly error = this._error.asReadonly()

  constructor() {
    this._setupRecipeStream()
  }

  public readonly setSearch = (term: string): Promise<void> =>
    this._filterService.setSearch(term)
  public readonly setCurrentPage = (page: number): Promise<void> =>
    this._filterService.setCurrentPage(page)
  public readonly setPageSize = (size: number): Promise<void> =>
    this._filterService.setPageSize(size)
  public readonly setSortBy = (by: string): Promise<void> =>
    this._filterService.setSortBy(by)
  public readonly setSortOrder = (order: SortOrder): Promise<void> =>
    this._filterService.setSortOrder(order)

  private _setupRecipeStream(): void {
    const { search, currentPage, pageSize, sortBy, sortOrder } =
      this._filterService
    combineLatest([
      toObservable(search),
      //toObservable(tags),
      toObservable(currentPage),
      toObservable(pageSize),
      toObservable(sortBy),
      toObservable(sortOrder)
    ])
      .pipe(
        debounceTime(0, asyncScheduler),
        tap(() => {
          this._loading.set(true)
          this._error.set(null)
        }),
        switchMap(([search, page, limit, sortBy, sortOrder]) => {
          return this._recipeApi
            .getRecipes({
              search,
              page,
              limit,
              sortBy,
              sortOrder
            })
            .pipe(
              catchError(err => {
                this._error.set(err)
                this._loading.set(false)
                this._recipes.set([])
                return of(null)
              })
            )
        }),
        tap(response => {
          if (response) {
            this._recipes.set(response.items)
            this._totalPages.set(response.meta.total_pages)
            this._totalItems.set(response.meta.total_items)
          }
          this._loading.set(false)
        })
      )
      .subscribe()
  }
}
