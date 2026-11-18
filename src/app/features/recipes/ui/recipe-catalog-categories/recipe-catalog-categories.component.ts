import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RecipeCatalogFilterService } from '@features/recipes/data/recipe-catalog-filter.service'
import { CATEGORIES_FILTER } from '@features/recipes/utils/constants'
import { SelectionController } from '@shared/behavior/selection'
import {
  ExpandableListComponent,
  ExpandableItemDirective
} from '@shared/ui/expandable-list'
import { ChipComponent } from '@shared/ui/chip'

@Component({
  selector: 'app-recipe-catalog-categories',
  templateUrl: './recipe-catalog-categories.component.html',
  styleUrl: './recipe-catalog-categories.component.scss',
  imports: [ExpandableListComponent, ChipComponent, ExpandableItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCatalogCategoriesComponent {
  private readonly _filter = inject(RecipeCatalogFilterService)

  protected readonly chips = CATEGORIES_FILTER.options
  private readonly _defaultCategory = this.chips[0]

  protected readonly selection = new SelectionController<string>({
    multiple: (): boolean => false,
    selectedIds: (): readonly string[] => {
      const category = this._filter.category()?.id ?? this._defaultCategory.id
      return category ? [category] : []
    },
    onChange: (ids): void => {
      const id = ids[0]
      const isDefault = id === this._defaultCategory.id
      this._filter.setCategory(isDefault ? null : id)
    },
    withDeselect: (): boolean => true
  })
}
