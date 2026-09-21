import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FilterCatalogComponent } from '../../shared/ui/filter-catalog/filter-catalog.component'
import { RecipeListService } from '../../features/recipes/service/recipes-list.service'
import {
  FILTER_FROM_PATH_CONFIG,
  FilterFromPathService
} from '../../shared/services/filter-from-path.service'

@Component({
  selector: 'app-page-recipes',
  templateUrl: './page-recipes.component.html',
  styleUrl: './page-recipes.component.scss',
  imports: [FilterCatalogComponent],
  providers: [
    {
      provide: FILTER_FROM_PATH_CONFIG,
      useValue: {
        defaultPageSize: 4,
        allowedSortBy: ['name', 'calories', 'cookingTime'],
        defaultSortBy: 'name',
        pathPrefix: 'recipeList'
      }
    },
    RecipeListService,
    FilterFromPathService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PagRecipeseComponent {
  protected readonly recipeListService = inject(RecipeListService)

  protected readonly currentPage = this.recipeListService.currentPage
  protected readonly pageSize = this.recipeListService.pageSize
  protected readonly sortBy = this.recipeListService.sortBy
  protected readonly sortOrder = this.recipeListService.sortOrder
  //protected readonly tags = this.recipeListService.tags
}
