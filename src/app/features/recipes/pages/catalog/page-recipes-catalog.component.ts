import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core'
import { RecipeCatalogService } from '../../data/recipes-catalog.service'
import { BreadcrumbsComponent } from '@shared/ui/breadcrumbs/breadcrumbs.component'
import { ChipGroupComponent } from '@shared/ui/chip-group'
import { PaginationComponent } from '@shared/ui/pagination'
import { DefaultButtonComponent } from '@shared/ui/default-button'
import { ShadowButtonComponent } from '@shared/ui/shadow-button'
import { RecipesFilterBarComponent } from '@features/recipes/ui/recipe-catalog-filter-bar'
import { RecipeCatalogActiveFiltersComponent } from '@features/recipes/ui/recipe-catalog-active-filters'
import { RecipeCatalogConfigService } from '@features/recipes/config'
import { RadioCheckboxGroupComponent } from '@shared/ui/radio-checkbox-group'

@Component({
  selector: 'app-page-recipes',
  templateUrl: './page-recipes-catalog.component.html',
  styleUrl: './page-recipes-catalog.component.scss',
  imports: [
    BreadcrumbsComponent,
    ChipGroupComponent,
    PaginationComponent,
    ShadowButtonComponent,
    RecipesFilterBarComponent,
    DefaultButtonComponent,
    RecipeCatalogActiveFiltersComponent,
    RadioCheckboxGroupComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PageRecipesCatalogComponent {
  private readonly _recipeList = inject(RecipeCatalogService)
  protected readonly _config = inject(RecipeCatalogConfigService)

  protected readonly filter = this._recipeList.filter
  protected readonly items = this._recipeList.items
  protected readonly loading = this._recipeList.loading
  protected readonly status = this._recipeList.status
  protected readonly totalPages = this._recipeList.totalPages
  protected readonly totalItems = this._recipeList.totalItems
  protected readonly hasMore = this._recipeList.hasMore

  protected readonly viewMode = this._config.viewMode

  protected readonly chips = [
    { id: 'all', label: 'Все категории' },
    { id: 'breakfast', label: 'Завтраки' },
    { id: 'desserts', label: 'Десерты' },
    { id: 'salads', label: 'Салаты' },
    { id: 'appetizers', label: 'Закуски' },
    { id: 'sides', label: 'Гарниры и овощи' },
    { id: 'pasta', label: 'Паста' },
    { id: 'soups', label: 'Супы' },
    { id: 'meat', label: 'Мясные блюда' },
    { id: 'poultry', label: 'Птица' },
    { id: 'fish', label: 'Рыба и морепродукты' },
    { id: 'drinks', label: 'Напитки' }
  ]
  protected readonly value = signal<string | null>('b')
  protected readonly pageSizeOptions = [4, 8, 12, 24]

  protected readonly chipValue = computed(() => {
    return [this.filter.category() ?? 'all']
  })

  protected readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  )

  protected onCategoriesChange(items: string[]): void {
    const id = items[0]
    void this.filter.setCategory(id === 'all' ? null : (id ?? null))
  }

  protected loadMore(): void {
    if (this.loading()) return
    const nextPage = this.filter.currentPage() + 1
    void this.filter.setCurrentPage(nextPage)
  }
}
