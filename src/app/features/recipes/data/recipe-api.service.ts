import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { API_BASE_URL } from '@core/config/tokens'
import {
  buildFiltersApiParams,
  buildPaginationParams,
  buildRangesParams,
  buildSearchApiParams,
  buildSelectApiParams,
  buildSortApiParams
} from '@core/api/params'
import {
  PagingApiResponse,
  RawPagingApiResponse,
  mapPagingResponse
} from '@core/api/paging'
import { RecipeCard, RequestParams } from '../models'

@Injectable()
export class RecipeApiService {
  private readonly _http = inject(HttpClient)
  private readonly _baseUrl = inject(API_BASE_URL)

  public getRecipes(
    params: RequestParams
  ): Observable<PagingApiResponse<RecipeCard>> {
    let httpParams = new HttpParams()

    httpParams = buildSelectApiParams(
      ['id', 'name', 'image', 'cookingTime', 'calories', 'dateCreated'],
      httpParams
    )

    if (params.category) {
      httpParams = buildFiltersApiParams(
        { 'categories.id': params.category.id },
        httpParams
      )
    }

    if (params.name) {
      httpParams = buildSearchApiParams({ name: params.name }, httpParams)
    }

    if (params.cookingTime) {
      httpParams = buildRangesParams(
        { cookingTime: params.cookingTime.range! },
        httpParams
      )
    }

    if (params.calories) {
      httpParams = buildRangesParams(
        { calories: params.calories.range! },
        httpParams
      )
    }

    httpParams = buildPaginationParams(params.page, params.limit, httpParams)

    httpParams = buildSortApiParams(params.sortBy, params.sortOrder, httpParams)

    return this._http
      .get<RawPagingApiResponse<RecipeCard>>(`${this._baseUrl}/recipes`, {
        params: httpParams
      })
      .pipe(map(mapPagingResponse))
  }
}
