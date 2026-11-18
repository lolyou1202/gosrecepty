import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  TemplateRef,
  viewChild
} from '@angular/core'
import type { SortOrder } from '@core/api/params'
import { RecipeCatalogFilterService } from '@features/recipes/data/recipe-catalog-filter.service'
import {
  SORT_BY_FILTER,
  SORT_ORDER_FILTER
} from '@features/recipes/utils/constants'
import { PopupService } from '@shared/ui/popup'
import { ShadowButtonComponent } from '@shared/ui/shadow-button'
import { RadioCheckboxGroupComponent } from '@shared/ui/radio-checkbox-group'
import { DividerComponent } from '@shared/ui/divider/divider.component'
import { findById } from '@shared/utils/functions/find-by-id'
import type { Nullable } from '@shared/utils/types'

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

  protected readonly sortBy = this._filter.sortBy
  protected readonly sortOrder = this._filter.sortOrder
  protected readonly sortByOptions = SORT_BY_FILTER.options
  protected readonly sortOrderOptions = SORT_ORDER_FILTER.options

  protected readonly sortByLabel = computed(
    () => findById(this.sortByOptions, this.sortBy())?.label || 'Сортировка'
  )

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
