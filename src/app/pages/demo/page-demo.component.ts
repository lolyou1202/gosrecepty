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
import {
  ChipGroupComponent,
  ChipOption
} from '../../shared/ui/chip-group/chip-group.component'
import { PillComponent } from '../../shared/ui/pill/pill.component'
import { ModalService } from '../../shared/ui/modal/modal.service'
import { DefaultInputComponent } from '../../shared/ui/default-input/default-input.component'

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
    DefaultInputComponent
  ]
})
export default class DemoPageComponent {
  private readonly _modalService = inject(ModalService)

  public readonly tpl = viewChild.required('tpl', { read: TemplateRef })

  // ==== данные для chip-group ====
  protected readonly singleChips: ChipOption[] = [
    { id: '1', label: 'Первый', active: true },
    { id: '2', label: 'Второй' },
    { id: '3', label: 'Третий' },
    { id: '4', label: 'Четвёртый' },
    { id: '5', label: 'Пятый' },
    { id: '6', label: 'Шестой' },
    { id: '7', label: 'Седьмой' },
    { id: '8', label: 'Восьмой' }
  ]

  protected readonly multiChips: ChipOption[] = [
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

  protected readonly preselectedChips: ChipOption[] = [
    { id: '1', label: 'Яблоко', active: true },
    { id: '2', label: 'Банан' },
    { id: '3', label: 'Вишня', active: true },
    { id: '4', label: 'Груша', active: true }
  ]

  // ==== значения ====
  protected readonly singleValue = signal<ChipOption | ChipOption[] | null>(
    null
  )
  protected readonly multiValue = signal<ChipOption | ChipOption[] | null>(null)
  protected readonly programmaticValue = signal<
    ChipOption | ChipOption[] | null
  >(null)

  protected readonly modalSingleValue = signal<
    ChipOption | ChipOption[] | null
  >(null)
  protected readonly modalMultiValue = signal<ChipOption | ChipOption[] | null>(
    null
  )

  // ==== производные ====
  protected readonly selectedLabels = computed(() => {
    const v = this.multiValue()
    if (!v) return ''
    const arr = Array.isArray(v) ? v : [v]
    return arr.map(c => c.label).join(', ')
  })

  // ==== действия ====
  protected selectFirstTwo(): void {
    this.programmaticValue.set(this.multiChips.slice(0, 2))
  }

  protected clearSelection(): void {
    this.programmaticValue.set(null)
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
}
