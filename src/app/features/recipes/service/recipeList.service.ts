import { BaseApiService } from '../../../core/service/base-api.service'
import { inject, Injectable, signal } from '@angular/core'
import { Observable } from 'rxjs'
import { RecipeDetail } from '../model/recipe.model'
import { HttpParams } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'

export interface RecipeForCard extends Pick<
  RecipeDetail,
  'id' | 'name' | 'imageUrl' | 'calories' | 'cookingTime' | 'tags' | 'statuses'
> {}

export type RecipeSortKey = keyof Pick<
  RecipeForCard,
  'name' | 'calories' | 'cookingTime'
>
export type RecipeSortOrder = 'asc' | 'desc'
export type RecipeFilters = {
  collection: ('favorites' | string)[]
  meal_type: ('breakfast' | 'lunch' | 'dinner' | string)[]
  cooking_method: ('pan' | 'oven' | string)[]
  dish_category: ('salad' | 'main' | 'soup' | string)[]
  cooking_time: ('1' | '2' | '3' | string)[]
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService extends BaseApiService<RecipeForCard> {
  private readonly _route = inject(ActivatedRoute)

  public readonly currentPage = signal<number>(1)
  public readonly totalPages = signal<number | null>(null)
  public readonly countShow = signal<number>(8)
  public readonly countItems = signal<number | null>(null)
  public readonly totalItems = signal<number | null>(null)
  public readonly pageSize = signal<number>(8)
  public readonly sortBy = signal<RecipeSortKey>('name')
  public readonly sortOrder = signal<RecipeSortOrder>('desc')
  public readonly filters = signal<Partial<RecipeFilters>>({
    collection: [],
    meal_type: [],
    cooking_method: [],
    dish_category: [],
    cooking_time: []
  })

  constructor() {
    super()

    const queryParams = this._route.snapshot.queryParams

    const filters = this.filters()
    const activeFilters = Object.entries(queryParams).reduce<
      Partial<RecipeFilters>
    >((acc, [key, value]) => {
      if (key in filters && value) {
        acc[key as keyof RecipeFilters] = String(value)
          .split(',')
          .map(v => v.trim())
          .filter(Boolean)
      }
      return acc
    }, {})
    console.log(queryParams)
  }

  public getRecipes(options?: {
    params?: Record<string, string>
  }): Observable<RecipeForCard[]> {
    const httpParams = new HttpParams()
      .appendAll(options?.params || {})
      .append('_select', 'id,name,imageUrl,calories,cookingTime,tags,statuses')

    return this.http.get<RecipeForCard[]>(`${this.baseUrl}/recipes`, {
      ...options,
      params: httpParams
    })
  }

  public getRecipeById(id: number): Observable<RecipeDetail> {
    return this.http.get<RecipeDetail>(`recipes/${id}`)
  }
}
