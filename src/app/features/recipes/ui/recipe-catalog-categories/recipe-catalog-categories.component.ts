import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core'
import { RecipeCatalogFilterService } from '@features/recipes/data/recipe-catalog-filter.service'
import { CATEGORIES_CHIPS } from '@features/recipes/utils/constants'
import { ChipGroupComponent } from '@shared/ui/chip-group'

@Component({
  selector: 'app-recipe-catalog-categories',
  templateUrl: './recipe-catalog-categories.component.html',
  styleUrl: './recipe-catalog-categories.component.scss',
  imports: [ChipGroupComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCatalogCategoriesComponent {
  private readonly _filter = inject(RecipeCatalogFilterService)

  protected readonly chips = CATEGORIES_CHIPS

  protected readonly chipValue = computed(() => {
    return [this._filter.category() ?? 'all']
  })

  protected onCategoriesChange(items: string[]): void {
    const id = items[0] ?? null
    this._filter.setCategory(id === 'all' ? null : id)
  }
}
