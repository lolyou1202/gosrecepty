import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core'
import {
  COOKING_TIME_CHIPS,
  CALORIES_CHIPS
} from '@features/recipes/utils/constants'
import { RecipeCatalogFilterService } from '@features/recipes/data/recipe-catalog-filter.service'
import { findFilterChip } from '@features/recipes/utils/functions'
import { type FilterPatch } from '@features/recipes/models'
import { PillComponent } from '@shared/ui/pill'
import { LinkButtonComponent } from '@shared/ui/link-button'
import { type RecipeCatalogActiveFilterPill } from './recipe-catalog-active-filters.model'

@Component({
  selector: 'app-recipe-catalog-active-filters',
  templateUrl: './recipe-catalog-active-filters.component.html',
  styleUrl: './recipe-catalog-active-filters.component.scss',
  imports: [PillComponent, LinkButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCatalogActiveFiltersComponent {
  private readonly _filter = inject(RecipeCatalogFilterService)

  protected readonly cookingTimeChips = COOKING_TIME_CHIPS
  protected readonly caloriesChips = CALORIES_CHIPS

  protected readonly pills = computed<RecipeCatalogActiveFilterPill[]>(() => {
    const result: RecipeCatalogActiveFilterPill[] = []

    const name = this._filter.name()
    if (name) {
      result.push({
        key: 'name',
        label: `Название: ${name}`
      })
    }

    const cookingChip = findFilterChip(
      this._filter.cookingTime(),
      COOKING_TIME_CHIPS
    )
    if (cookingChip) {
      result.push({
        key: 'cookingTime',
        label: `Время приготовления: ${cookingChip.label}`
      })
    }

    const caloriesChip = findFilterChip(this._filter.calories(), CALORIES_CHIPS)
    if (caloriesChip) {
      result.push({
        key: 'calories',
        label: `Калорийность: ${caloriesChip.label}`
      })
    }

    return result
  })

  protected readonly hasPills = computed(() => this.pills().length > 0)
  protected readonly canClearAll = computed(() => this.pills().length > 1)

  protected removeFilter(key: keyof FilterPatch): Promise<void> {
    return this._filter.removeFilter(key)
  }

  protected clearAllFilters(): Promise<void> {
    return this._filter.clearAllFilters()
  }
}
