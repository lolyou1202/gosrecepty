import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core'
import { RecipeCatalogFilterService } from '@features/recipes/data/recipe-catalog-filter.service'
import { FilterPatch } from '@features/recipes/models'
import { PillComponent } from '@shared/ui/pill'
import { RecipeCatalogSettingsComponent } from '../recipe-catalog-settings'
import { RecipeCatalogFilterComponent } from '../recipe-catalog-filter'
import { RecipeCatalogSortingComponent } from '../recipe-catalog-sorting'

@Component({
  selector: 'app-recipe-catalog-toolbar',
  templateUrl: './recipe-catalog-toolbar.component.html',
  styleUrl: './recipe-catalog-toolbar.component.scss',
  imports: [
    RecipeCatalogSettingsComponent,
    RecipeCatalogFilterComponent,
    RecipeCatalogSortingComponent,
    PillComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCatalogToolbarComponent {
  private readonly _filter = inject(RecipeCatalogFilterService)

  protected pills = this._filter.pills

  protected readonly hasPills = computed(() => this.pills().length > 0)
  protected readonly canClearAll = computed(() => this.pills().length > 1)

  protected removeFilter(key: keyof FilterPatch): Promise<void> {
    return this._filter.removeFilter(key)
  }

  protected clearAllFilters(): Promise<void> {
    return this._filter.clearAllFilters()
  }
}
