import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  TemplateRef,
  viewChild
} from '@angular/core'
import type { SortOrder } from '@core/api/params'
import { PopupService } from '@shared/ui/popup'
import { ShadowButtonComponent } from '@shared/ui/shadow-button'
import {
  RadioCheckboxOption,
  RadioCheckboxGroupComponent
} from '@shared/ui/radio-checkbox-group'
import { DividerComponent } from '@shared/ui/divider/divider.component'
import type { Nullable } from '@shared/utils/types'
import { RecipeCatalogFilterService } from '@features/recipes/data/recipe-catalog-filter.service'

@Component({
  selector: 'app-recipe-catalog-sorting',
  templateUrl: './recipe-catalog-sorting.component.html',
  styleUrl: './recipe-catalog-sorting.component.scss',
  imports: [
    ShadowButtonComponent,
    RadioCheckboxGroupComponent,
    DividerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCatalogSortingComponent {
  private readonly _popupService = inject(PopupService)
  private readonly _filter = inject(RecipeCatalogFilterService)

  protected readonly tpl = viewChild.required('tpl', { read: TemplateRef })

  protected readonly sortOrder = this._filter.sortOrder
  protected readonly sortBy = this._filter.sortBy

  protected readonly sortByLabel = computed(
    () =>
      this.sortByOptions.find(el => el.id === this.sortBy())?.label ||
      'Сортировка'
  )

  protected readonly sortOrderOptions: RadioCheckboxOption<SortOrder>[] = [
    { id: 'asc', label: 'По возрастанию' },
    { id: 'desc', label: 'По убыванию' }
  ]

  protected readonly sortByOptions: RadioCheckboxOption<string>[] = [
    { id: 'name', label: 'По названию' },
    { id: 'calories', label: 'По калориям' },
    { id: 'cookingTime', label: 'По времени' }
  ]

  protected onSortOrderChange(value: Nullable<SortOrder>): void {
    if (!value) return
    this._filter.setSortOrder(value)
  }

  protected onSortByChange(value: Nullable<string>): void {
    if (!value) return
    this._filter.setSortBy(value)
  }

  protected openPopup(event: PointerEvent): void {
    const origin = event.currentTarget
    if (origin instanceof HTMLElement) {
      this._popupService.open(origin, this.tpl(), {
        title: 'Сортировка',
        width: 240
      })
    }
  }
}
