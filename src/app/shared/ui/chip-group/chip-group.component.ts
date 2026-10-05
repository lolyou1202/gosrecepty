import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  linkedSignal,
  model,
  signal,
  untracked
} from '@angular/core'
import { FormValueControl } from '@angular/forms/signals'
import { ChipComponent } from '../chip/chip.component'
import { ExpandableListComponent } from '../expandable-list/expandable-list.component'
import { ExpandableItemDirective } from '../expandable-list/expandable-item.directive'

export interface ChipOption {
  id: string
  active?: boolean
  label?: string
  icon?: string
}

@Component({
  selector: 'app-chip-group',
  templateUrl: './chip-group.component.html',
  styleUrl: './chip-group.component.scss',
  imports: [ChipComponent, ExpandableListComponent, ExpandableItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipGroupComponent<
  T extends ChipOption
> implements FormValueControl<T | T[] | null> {
  public readonly variant = input<'inside' | 'outside'>('inside')
  public readonly multiple = input<boolean>(false)
  public readonly chips = input<T[]>([])
  public readonly readonly = input<boolean>(false)
  public readonly disabled = input<boolean>(false)

  public readonly touched = model<boolean>(false)
  public readonly value = model<T | T[] | null>(null)

  // Отделяет "пустое, потому что не задано" от "пустое, потому что сняли всё"
  private readonly _interacted = signal(false)

  protected readonly selectedIds = linkedSignal({
    source: () => ({
      value: this.value(),
      chips: this.chips(),
      interacted: this._interacted()
    }),
    computation: ({ value, chips, interacted }) => {
      // Явно заданное значение имеет приоритет
      // Пустой массив — это валидное "пусто", а не "не задано"
      if (Array.isArray(value)) {
        return new Set(value.map(c => c.id))
      }
      if (value) {
        return new Set([value.id])
      }

      // value == null и пользователь ещё не трогал — поднимаем active из конфига
      // Работает и когда чипсы приехали асинхронно, т.к. chips в source
      if (!interacted && chips.length > 0) {
        return new Set(chips.filter(c => c.active).map(c => c.id))
      }

      return new Set<string>()
    }
  })

  constructor() {
    // Валидация конфигурации
    effect(() => {
      const chips = this.chips()
      if (chips.length === 0) return

      const activeChips = chips.filter(c => c.active)
      if (!this.multiple() && activeChips.length > 1) {
        throw new Error(
          `[ChipGroupComponent] Некорректная конфигурация: multiple=false, но активных чипсов ${activeChips.length} (${activeChips.map(c => c.id).join(', ')}).`
        )
      }
    })

    // selectedIds -> внешнее value
    effect(() => {
      const ids = this.selectedIds()
      const chips = this.chips()
      const multiple = this.multiple()

      // Чипсы ещё не загружены — не затираем то, что мог выставить родитель
      if (chips.length === 0) return

      const selected = chips.filter(chip => ids.has(chip.id))
      const nextValue: T | T[] | null = multiple
        ? selected // multiple: пустое значение — []
        : (selected[0] ?? null) // single: пустое значение — null

      const currentValue = untracked(this.value)
      if (this._valuesEqual(currentValue, nextValue)) return
      untracked(() => this.value.set(nextValue))
    })
  }

  protected onChipCheckedChange(chip: T, checked: boolean): void {
    // Как только пользователь что-то сделал — больше не подтягиваем active
    this._interacted.set(true)

    const ids = new Set(this.selectedIds())

    if (!this.multiple()) {
      if (checked) {
        ids.clear()
        ids.add(chip.id)
      } else {
        ids.delete(chip.id)
      }
    } else {
      if (checked) ids.add(chip.id)
      else ids.delete(chip.id)
    }

    this.selectedIds.set(ids)
    this.touched.set(true)
  }

  protected isSelected(id: string): boolean {
    return this.selectedIds().has(id)
  }

  private _valuesEqual(a: T | T[] | null, b: T | T[] | null): boolean {
    if (a === b) return true
    if (a == null || b == null) return false

    const aArr = Array.isArray(a) ? a : [a]
    const bArr = Array.isArray(b) ? b : [b]

    if (aArr.length !== bArr.length) return false
    return aArr.every((item, i) => item.id === bArr[i]?.id)
  }
}
