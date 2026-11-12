import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model
} from '@angular/core'
import { FormValueControl } from '@angular/forms/signals'
import { SelectionController } from '@shared/behavior/selection'
import { ExpandableListComponent } from '../expandable-list/expandable-list.component'
import { ExpandableItemDirective } from '../expandable-list/expandable-item.directive'
import { ChipComponent, ChipSide, ChipStyleVariant } from '../chip'
import { ChipGroupItem } from './chip-group.model'

@Component({
  selector: 'app-chip-group',
  templateUrl: './chip-group.component.html',
  styleUrl: './chip-group.component.scss',
  imports: [ExpandableListComponent, ExpandableItemDirective, ChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipGroupComponent<
  T extends string | number
> implements FormValueControl<T[]> {
  public readonly value = model<T[]>([])

  public readonly chips = input.required<ChipGroupItem<T>[]>()
  public readonly side = input<ChipSide>('inside')
  public readonly styleVariant = input<ChipStyleVariant>('outlined')
  public readonly collapsible = input<boolean>(true)
  public readonly multiple = input<boolean>(true)
  public readonly gap = input<number>(12)
  public readonly disabled = input<boolean>(false)

  public readonly expanded = model(false)

  protected readonly selection = new SelectionController<T>({
    multiple: (): boolean => this.multiple(),
    selectedIds: (): readonly T[] => this.value(),
    onChange: (ids): void => this.value.set(ids),
    withDeselect: (): boolean => true
  })

  protected readonly groupRole = computed(() =>
    this.multiple() ? 'group' : 'radiogroup'
  )
	
  protected readonly optionRole = computed(() =>
    this.multiple() ? 'checkbox' : 'radio'
  )

  public focus(): void {}
}
