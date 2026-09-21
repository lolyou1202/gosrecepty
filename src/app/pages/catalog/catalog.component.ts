import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FilterCatalogComponent } from '../../shared/ui/filter-catalog/filter-catalog.component'
import { RecipeService } from '../../features/recipes/service/recipeList.service'

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  imports: [FilterCatalogComponent],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent {
  private _recipeService = inject(RecipeService)

  public ngOnInit(): void {
    //this._recipeService.getRecipes().subscribe(data => console.log(data))
  }
}
