import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model
} from '@angular/core'
import { SelectionGroupDirective } from '@shared/behavior/selection'
import { ExpandableListComponent } from '../expandable-list/expandable-list.component'
import { ExpandableItemDirective } from '../expandable-list/expandable-item.directive'
import { ChipComponent, ChipSide, ChipStyleVariant } from '../chip'
import { ChipGroupItem } from './chip-group.model'
import { FormValueControl } from '@angular/forms/signals'

@Component({
  selector: 'app-chip-group',
  templateUrl: './chip-group.component.html',
  styleUrl: './chip-group.component.scss',
  imports: [ExpandableListComponent, ExpandableItemDirective, ChipComponent],
  hostDirectives: [
    {
      directive: SelectionGroupDirective,
      inputs: ['value', 'multiple', 'withDeselect'],
      outputs: ['valueChange']
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipGroupComponent<
  T extends string | number
> implements FormValueControl<T[]> {
  private readonly _selection = inject<SelectionGroupDirective<T>>(
    SelectionGroupDirective
  )

  public readonly chips = input.required<ChipGroupItem<T>[]>()
  public readonly side = input<ChipSide>('inside')
  public readonly styleVariant = input<ChipStyleVariant>('outlined')
  public readonly collapsible = input<boolean>(true)
  public readonly gap = input<number>(12)
  public readonly disabled = input<boolean>(false)

  public readonly expanded = model(false)

  public readonly value = this._selection.value
  public readonly multiple = this._selection.multiple
  public readonly withDeselect = this._selection.withDeselect
  public readonly isSelected = this._selection.isSelected
  public readonly select = this._selection.select
  public readonly deselect = this._selection.deselect
  public readonly toggle = this._selection.toggle
  public readonly clear = this._selection.clear

  protected readonly groupRole = computed(() =>
    this.multiple() ? 'group' : 'radiogroup'
  )
  protected readonly optionRole = computed(() =>
    this.multiple() ? 'checkbox' : 'radio'
  )

  public focus(): void {}
}
