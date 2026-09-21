import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { PagingApiResponse, SortOrder } from '../../../core/api/api-base.model'
import { RecipeCard } from '../model/recipe.model'
import { ApiBaseService } from '../../../core/api/api-base.service'

@Injectable({ providedIn: 'root' })
export class RecipeApiService {
  private readonly _http = inject(HttpClient)
  private readonly _apiBase = inject(ApiBaseService)

  public getRecipes({
    search,
    page,
    limit,
    sortBy,
    sortOrder
  }: {
    search: string
    page: number
    limit: number
    sortBy: string
    sortOrder: SortOrder
  }): Observable<PagingApiResponse<RecipeCard>> {
    let httpParams: HttpParams = this._apiBase.buildApiOptions({
      select: ['id', 'name', 'image', 'cookingTime', 'calories'],
      search: [{ field: 'name', value: search }],
      page,
      limit,
      sortBy,
      sortOrder
    })

    return this._http.get<PagingApiResponse<RecipeCard>>(
      `${this._apiBase.url}/recipes`,
      {
        params: httpParams
      }
    )
  }
}
