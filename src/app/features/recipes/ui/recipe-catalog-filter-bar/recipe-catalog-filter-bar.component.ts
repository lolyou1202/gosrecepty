import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  TemplateRef,
  viewChild
} from '@angular/core'
import { apply, form, FormField } from '@angular/forms/signals'
import { ModalService } from '@shared/ui/modal/modal.service'
import {
  COOKING_TIME_CHIPS,
  CALORIES_CHIPS
} from '@features/recipes/utils/constants'
import { chipToForm } from '@features/recipes/utils/functions'
import { FilterPatch } from '@features/recipes/models'
import { ShadowButtonComponent } from '@shared/ui/shadow-button'
import { ChipGroupComponent } from '@shared/ui/chip-group'
import { BaseInputComponent } from '@shared/ui/base-input'
import { nameSchema } from './name.schema'
import { RecipeCatalogFilterForm } from './recipe-catalog-filter-bar.model'
import { RecipeCatalogFilterService } from '@features/recipes/data/recipe-catalog-filter.service'

@Component({
  selector: 'app-recipe-catalog-filter-bar',
  templateUrl: './recipe-catalog-filter-bar.component.html',
  styleUrl: './recipe-catalog-filter-bar.component.scss',
  imports: [
    ShadowButtonComponent,
    ChipGroupComponent,
    BaseInputComponent,
    FormField
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesFilterBarComponent {
  private readonly _modalService = inject(ModalService)
  private readonly _filter = inject(RecipeCatalogFilterService)

  protected readonly tpl = viewChild.required('tpl', { read: TemplateRef })

  protected readonly cookingTimeChips = COOKING_TIME_CHIPS
  protected readonly caloriesChips = CALORIES_CHIPS

  protected readonly emptyForm: RecipeCatalogFilterForm = {
    name: '',
    cookingTime: [],
    calories: []
  }

  protected readonly hasActiveFilters = this._filter.hasActiveFilters

  public readonly form = form(signal(this.emptyForm), schema => {
    apply(schema.name, nameSchema)
  })

  private readonly _formValue = computed<FilterPatch>(() => {
    const value = this.form().value()
    return {
      name: value.name || null,
      cookingTime: value.cookingTime[0] ?? null,
      calories: value.calories[0] ?? null
    }
  })

  private readonly _isFormEmpty = computed(() => {
    return (
      this._formValue().name === null &&
      this._formValue().cookingTime === null &&
      this._formValue().calories === null
    )
  })

  private readonly _isApplyDisabled = computed(() => {
    if (this.form().invalid()) return true

    const formValue = this._formValue()

    const nameEqual = formValue.name === this._filter.name()
    const cookingTimeEqual =
      formValue.cookingTime === this._filter.cookingTime()
    const caloriesEqual = formValue.calories === this._filter.calories()

    return nameEqual && cookingTimeEqual && caloriesEqual
  })

  public resetModalForm(): void {
    this.form().reset(this.emptyForm)
  }

  public async applyModalForm(): Promise<void> {
    const formValue = this._formValue()

    const patch: FilterPatch = {}
    if (formValue.name !== this._filter.name()) {
      patch.name = formValue.name
    }
    if (formValue.cookingTime !== this._filter.cookingTime()) {
      patch.cookingTime = formValue.cookingTime
    }
    if (formValue.calories !== this._filter.calories()) {
      patch.calories = formValue.calories
    }

    if (Object.keys(patch).length === 0) return

    try {
      await this._filter.patchFilters(patch)
    } catch (error) {
      console.error('[RecipesFilterBar] ошибка применения фильтров', error)
      throw error
    }
  }

  private _prefillFromFilter(): void {
    this.form().reset({
      name: this._filter.name() ?? '',
      cookingTime: chipToForm(COOKING_TIME_CHIPS, this._filter.cookingTime()),
      calories: chipToForm(CALORIES_CHIPS, this._filter.calories())
    })
  }

  protected openModal(): void {
    this._prefillFromFilter()

    const modalRef = this._modalService.open(this.tpl(), {
      title: 'Фильтры',
      actions: [
        {
          variant: 'secondary',
          text: 'Сбросить',
          disabled: this._isFormEmpty,
          onClick: (): void => {
            this.resetModalForm()
          }
        },
        {
          variant: 'primary',
          text: 'Применить',
          disabled: this._isApplyDisabled,
          onClick: async (): Promise<void> => {
            await this.applyModalForm()
            modalRef.close()
          }
        }
      ]
    })
  }
}
