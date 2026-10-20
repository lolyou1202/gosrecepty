import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
  TemplateRef
} from '@angular/core'
import { ButtonLightComponent } from '../../shared/ui/button-light/button-light.component'
import { ChipComponent } from '../../shared/ui/chip/chip.component'
import { ChipGroupComponent } from '../../shared/ui/chip-group/chip-group.component'
import { PillComponent } from '../../shared/ui/pill/pill.component'
import { ModalService } from '../../shared/ui/modal/modal.service'
import { BaseInputComponent } from '../../shared/ui/base-input/base-input.component'
import { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals'
import { SelectionGroupDirective } from '../../shared/behavior/selection/selection-group.directive'
import { ExpandableListComponent } from '../../shared/ui/expandable-list/expandable-list.component'
import { ExpandableItemDirective } from '../../shared/ui/expandable-list/expandable-item.directive'
import { BreadcrumbsComponent } from '../../shared/ui/breadcrumbs/breadcrumbs.component'

@Component({
  selector: 'app-page-demo',
  templateUrl: './page-demo.component.html',
  styleUrl: './page-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonLightComponent,
    ChipComponent,
    ChipGroupComponent,
    PillComponent,
    BaseInputComponent,
    SelectionGroupDirective,
    ExpandableListComponent,
    BreadcrumbsComponent
  ]
})
export default class DemoPageComponent {
  private readonly _modalService = inject(ModalService)

  public readonly tpl = viewChild.required('tpl', { read: TemplateRef })

  // ==== данные для chip-group ====
  protected readonly singleChips = [
    { id: '1', label: 'Первый', active: true },
    { id: '2', label: 'Второй' },
    { id: '3', label: 'Третий' },
    { id: '4', label: 'Четвёртый' },
    { id: '5', label: 'Пятый' },
    { id: '6', label: 'Шестой' },
    { id: '7', label: 'Седьмой' },
    { id: '8', label: 'Восьмой' }
  ]

  protected readonly multiChips = [
    { id: '1', label: 'Дизайн' },
    { id: '2', label: 'Разработка', active: true },
    { id: '3', label: 'Тестирование', active: true },
    { id: '4', label: 'Деплой' },
    { id: '5', label: 'Маркетинг' },
    { id: '6', label: 'Администрирование' },
    { id: '7', label: 'Интернет-маркетинг' },
    { id: '8', label: 'Бизнес-процессы' },
    { id: '9', label: 'Аналитика' },
    { id: '10', label: 'Информационные технологии' }
  ]

  protected readonly preselectedChips = [
    { id: '1', label: 'Яблоко', active: true },
    { id: '2', label: 'Банан' },
    { id: '3', label: 'Вишня', active: true },
    { id: '4', label: 'Груша', active: true }
  ]

  // ==== значения ====
  protected readonly singleValue = signal(null)
  protected readonly multiValue = signal(null)
  protected readonly programmaticValue = signal([])

  protected readonly modalSingleValue = signal(null)
  protected readonly modalMultiValue = signal(null)

  // ==== производные ====
  protected readonly selectedLabels = computed(() => {
    const v = this.multiValue()
    if (!v) return ''
    const arr = Array.isArray(v) ? v : [v]
    return arr.map(c => c).join(', ')
  })

  // ==== действия ====
  protected selectFirstTwo(): void {
    //this.programmaticValue.set(this.multiChips)
  }

  protected clearSelection(): void {
    this.programmaticValue.set([])
  }

  protected openModal(): void {
    this._modalService.open(this.tpl(), {
      title: 'Выбор вариантов',
      actions: [
        { variant: 'secondary', text: 'Отмена', closeOnClick: true },
        { variant: 'primary', text: 'Готово' }
      ]
    })
  }

  protected readonly clearableValue = signal('')

  // --- ошибки для примера ---
  protected readonly emailErrors: readonly WithOptionalFieldTree<ValidationError>[] =
    [
      {
        message: 'Некорректный email'
      } as WithOptionalFieldTree<ValidationError>
    ]

  protected readonly passwordErrors: readonly WithOptionalFieldTree<ValidationError>[] =
    [
      {
        message: 'Минимум 8 символов'
      } as WithOptionalFieldTree<ValidationError>,
      {
        message: 'Должна быть хотя бы одна цифра'
      } as WithOptionalFieldTree<ValidationError>,
      {
        message: 'Должна быть хотя бы одна заглавная буква'
      } as WithOptionalFieldTree<ValidationError>
    ]

  // --- интерактивный пример ---
  protected readonly interactiveValue = signal('')
  protected readonly interactiveTouched = signal(false)

  protected readonly interactiveInvalid = computed(
    () =>
      this.interactiveValue().length > 0 && this.interactiveValue().length < 5
  )

  protected readonly interactiveErrors = computed<
    readonly WithOptionalFieldTree<ValidationError>[]
  >(() =>
    this.interactiveInvalid()
      ? [
          {
            message: 'Минимум 5 символов'
          } as WithOptionalFieldTree<ValidationError>
        ]
      : []
  )

  protected onDisplayClick(): void {
    console.log('display clicked')
  }

  protected resetInteractive(): void {
    this.interactiveValue.set('')
    this.interactiveTouched.set(false)
  }

  protected fillValid(): void {
    this.interactiveValue.set('валидное значение')
  }
}
