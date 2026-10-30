import { Routes } from '@angular/router'
import {
  QUERY_PARAMS_PREFIX,
  QueryParamsService
} from '@shared/services/query-params.service'
import { RecipeCatalogService } from './data/recipes-catalog.service'
import { RecipeCatalogFilterService } from './data/recipe-catalog-filter.service'
import { RecipeApiService } from './data/recipe-api.service'
import { RecipeCatalogConfigService } from './config/recipe-catalog-config.service'

const recipeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/catalog/page-recipes-catalog.component'),
    providers: [
      RecipeCatalogService,
      RecipeCatalogFilterService,
      RecipeCatalogConfigService,
      RecipeApiService,
      QueryParamsService,
      {
        provide: QUERY_PARAMS_PREFIX,
        useValue: 'recipeList'
      }
    ]
  }
]

export default recipeRoutes
