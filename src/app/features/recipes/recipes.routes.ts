import { Routes } from '@angular/router'
import {
  PAGINATION_SORT_CONFIG,
  PaginationSortConfig,
  PaginationSortService
} from '@shared/data/filter-from-path/pagination-sort.service'
import {
  QUERY_PARAMS_PREFIX,
  QueryParamsService
} from '@shared/data/filter-from-path/query-params.service'
import { RecipeListService } from './data/recipes-list.service'
import { RecipeListFilterService } from './data/recipe-list-filter.service'
import { RecipeApiService } from './data/recipe-api.service'

const recipeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/catalog/page-recipes-catalog.component'),
    providers: [
      { provide: QUERY_PARAMS_PREFIX, useValue: 'recipeList' },
      {
        provide: PAGINATION_SORT_CONFIG,
        useValue: {
          defaultPageSize: 12,
          allowedSortBy: ['name'],
          defaultSortBy: 'name'
        } satisfies PaginationSortConfig
      },
      QueryParamsService,
      PaginationSortService,
      RecipeListFilterService,
      RecipeListService,
      RecipeApiService
    ]
  }
]

export default recipeRoutes
