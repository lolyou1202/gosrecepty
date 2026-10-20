import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core'
import { RecipeListService } from '../../data/recipes-list.service'
import { BreadcrumbsComponent } from '@shared/ui/breadcrumbs/breadcrumbs.component'
import { ChipGroupComponent } from '@shared/ui/chip-group'
import { ChipGroupValue } from '@shared/ui/chip-group/chip-group.model'
import { PaginationComponent } from '@shared/ui/pagination'

@Component({
  selector: 'app-page-recipes',
  templateUrl: './page-recipes-catalog.component.html',
  styleUrl: './page-recipes-catalog.component.scss',
  imports: [BreadcrumbsComponent, ChipGroupComponent, PaginationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PageRecipesCatalogComponent {
  private readonly _recipeList = inject(RecipeListService)

  protected readonly filter = this._recipeList.filter
  protected readonly items = this._recipeList.items
  protected readonly loading = this._recipeList.loading
  protected readonly status = this._recipeList.status
  protected readonly totalPages = this._recipeList.totalPages
  protected readonly totalItems = this._recipeList.totalItems
  protected readonly hasMore = this._recipeList.hasMore

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

  protected readonly pageSizeOptions = [4, 8, 12, 24]

  protected readonly selectedCategory = computed(() => this.filter.category())

  protected readonly chipValue = computed<ChipGroupValue[]>(() => {
    const id = this.selectedCategory() ?? 'all'
    return this.chips.filter(c => c.id === id)
  })

  protected readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  )

  protected onCategoriesChange(items: ChipGroupValue[]): void {
    const id = items[0]?.id
    void this.filter.setCategory(id === 'all' ? null : (id ?? null))
  }

  protected loadMore(): void {
    if (this.loading()) return
    const nextPage = this.filter.currentPage() + 1
    void this.filter.setCurrentPage(nextPage)
  }
}
