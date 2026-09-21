import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  linkedSignal,
  model,
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
  public variant = input<'inside' | 'outside'>('inside')
  public multiple = input<boolean>(false)
  public chips = input<T[]>([])

  public readonly = input<boolean>(false)
  public disabled = input<boolean>(false)
  public touched = model<boolean>(false)
  public value = model<T | T[] | null>(null)

  protected selectedIds = linkedSignal<T | T[] | null, Set<string>>({
    source: () => this.value(),
    computation: (value, previous) => {
      if (value) {
        return Array.isArray(value)
          ? new Set(value.map(c => c.id))
          : new Set([value.id])
      }

      // value === null
      if (previous) return new Set<string>() // не первый прогон — уважаем очистку

      // Первый прогон — поднимаем active из конфига
      // untracked, чтобы последующие изменения chips не пересчитывали computation
      return untracked(
        () =>
          new Set(
            this.chips()
              .filter(c => c.active)
              .map(c => c.id)
          )
      )
    }
  })

  constructor() {
    effect(() => {
      const chips = this.chips()
      if (chips.length === 0) return

      const activeChips = chips.filter(c => c.active)
      if (!this.multiple() && activeChips.length > 1) {
        throw new Error(
          `[ChipGroupComponent] Некорректная конфигурация: multiple=false, но в чипсах найдено ${activeChips.length} активных элементов (${activeChips.map(c => c.id).join(', ')}). В режиме одиночного выбора допустим только один чип с active: true.`
        )
      }
    })

    // selectedIds -> внешнее value
    effect(() => {
      const ids = this.selectedIds()
      const selected = this.chips().filter(chip => ids.has(chip.id))
      const nextValue = this.multiple()
        ? selected.length
          ? selected
          : null
        : (selected[0] ?? null)

      const currentValue = untracked(this.value)
      if (this._valuesEqual(currentValue, nextValue)) return
      untracked(() => this.value.set(nextValue))
    })
  }

  protected onChipCheckedChange(chip: T, checked: boolean): void {
    const ids = new Set(this.selectedIds())

    if (!this.multiple()) {
      if (checked) {
        ids.clear()
        ids.add(chip.id)
      } else {
        ids.delete(chip.id)
      }
    } else {
      if (checked) {
        ids.add(chip.id)
      } else {
        ids.delete(chip.id)
      }
    }

    this.selectedIds.set(ids)
    this.touched.set(true)
  }

  protected isSelected(id: string): boolean {
    return this.selectedIds().has(id)
  }

  private _valuesEqual<T extends ChipOption>(
    a: T | T[] | null,
    b: T | T[] | null
  ): boolean {
    if (a === b) return true
    if (a == null || b == null) return false

    const aArr = Array.isArray(a) ? a : [a]
    const bArr = Array.isArray(b) ? b : [b]

    if (aArr.length !== bArr.length) return false
    return aArr.every((item, i) => item.id === bArr[i]?.id)
  }
}
