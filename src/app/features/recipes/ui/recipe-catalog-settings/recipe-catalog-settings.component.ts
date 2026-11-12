import {
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
  viewChild
} from '@angular/core'
import { RecipeCatalogConfigService } from '@features/recipes/config'
import { PopupService } from '@shared/ui/popup'
import { ShadowButtonComponent } from '@shared/ui/shadow-button'
import {
  RadioCheckboxOption,
  RadioCheckboxGroupComponent
} from '@shared/ui/radio-checkbox-group'
import { DividerComponent } from '@shared/ui/divider/divider.component'
import type { Nullable, ViewMode } from '@shared/utils/types'
import { RecipeCatalogCardsAppearance } from './recipe-catalog-settings'

@Component({
  selector: 'app-recipe-catalog-settings',
  templateUrl: './recipe-catalog-settings.component.html',
  styleUrl: './recipe-catalog-settings.component.scss',
  imports: [
    ShadowButtonComponent,
    RadioCheckboxGroupComponent,
    DividerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCatalogSettingsComponent {
  private readonly _popupService = inject(PopupService)
  private readonly _config = inject(RecipeCatalogConfigService)

  protected readonly tpl = viewChild.required('tpl', { read: TemplateRef })

  protected readonly viewMode = this._config.viewMode

  protected readonly viewModeOptions: RadioCheckboxOption<ViewMode>[] = [
    { id: 'lazy', label: 'По мере прокрутки' },
    { id: 'pagination', label: 'Постранично' }
  ]

  protected readonly cardsAppearanceOptions: RadioCheckboxOption<RecipeCatalogCardsAppearance>[] =
    [
      { id: 'wide', label: 'Крупные' },
      { id: 'compact', label: 'Компактные' }
    ]

  protected onViewModeChange(value: Nullable<ViewMode>): void {
    if (!value) return
    this._config.update({ viewMode: value })
  }

  protected onCardsAppearanceChange(
    value: Nullable<RecipeCatalogCardsAppearance>
  ): void {
    if (!value) return
  }

  protected openPopup(event: PointerEvent): void {
    const origin = event.currentTarget
    if (origin instanceof HTMLElement) {
      this._popupService.open(origin, this.tpl(), {
        title: 'Настройки списка',
        width: 240
      })
    }
  }
}
