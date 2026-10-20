import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { ApiBaseService } from '@core/api/api-base.service'
import {
  PagingApiResponse,
  RawPagingApiResponse
} from '@core/api/api-base.model'
import { SortOrder } from '@shared/data/filter-from-path/pagination-sort.service'
import { RecipeCard } from '../model/recipe.model'
import { mapPagingResponse } from '@core/api/paging.mapper'

@Injectable()
export class RecipeApiService {
  private readonly _http = inject(HttpClient)
  private readonly _apiBase = inject(ApiBaseService)

  public getRecipes({
    category,
    page,
    limit,
    sortBy,
    sortOrder
  }: {
    category: string | null
    page: number
    limit: number
    sortBy: string
    sortOrder: SortOrder
  }): Observable<PagingApiResponse<RecipeCard>> {
    const filters: Record<
      string,
      string | number | boolean | (string | number | boolean)[]
    > = {}

    if (category) {
      filters['categories.id'] = category
    }

    const httpParams: HttpParams = this._apiBase.buildApiOptions({
      select: [
        'id',
        'name',
        'image',
        'cookingTime',
        'caloriesPerPortion',
        'dateCreated'
      ],
      filters,
      page,
      limit,
      sortBy,
      sortOrder
    })

    return this._http
      .get<RawPagingApiResponse<RecipeCard>>(`${this._apiBase.url}/recipes`, {
        params: httpParams
      })
      .pipe(map(mapPagingResponse))
  }
}
