import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  linkedSignal,
  model,
  untracked
} from '@angular/core'
import { SelectionGroupDirective } from '../../behavior/selection/selection-group.directive'
import { ExpandableListComponent } from '../expandable-list/expandable-list.component'
import { ExpandableItemDirective } from '../expandable-list/expandable-item.directive'
import { ChipComponent } from '../chip/chip.component'
import { ChipVariant } from '../chip/chip.model'
import { ChipGroupItem, ChipGroupValue } from './chip-group.model'
import { FormValueControl } from '@angular/forms/signals'

@Component({
  selector: 'app-chip-group',
  templateUrl: './chip-group.component.html',
  styleUrl: './chip-group.component.scss',
  imports: [
    SelectionGroupDirective,
    ExpandableListComponent,
    ExpandableItemDirective,
    ChipComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipGroupComponent implements FormValueControl<ChipGroupValue[]> {
  public readonly chips = input.required<ChipGroupItem[]>()
  public readonly multiple = input<boolean>(false)
  public readonly chipsVariant = input<ChipVariant>('inside')
  public readonly collapsible = input<boolean>(true)
  public readonly gap = input<number>(12)
  public readonly disabled = input<boolean>(false)

  public readonly value = model<ChipGroupValue[]>([])
  public readonly expanded = model(false)

  public readonly selectedIds = linkedSignal({
    source: () => ({
      value: this.value()
    }),
    computation: ({ value }) => value.map(c => c.id)
  })

  constructor() {
    effect(() => {
      const ids = this.selectedIds()
      const chips = this.chips()

      if (chips.length === 0) return

      const idsSet = new Set(ids)
      const selected = chips
        .filter(chip => idsSet.has(chip.id))
        .map(i => ({ id: i.id, value: i.label }))

      const currentValue = untracked(this.value)
      if (
        currentValue.length === selected.length &&
        currentValue.every(item => idsSet.has(item.id))
      )
        return

      this.value.set(selected)
    })
  }

  public focus(): void {}
}
