import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output
} from '@angular/core'
import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree
} from '@angular/forms/signals'
import { RadioCheckboxComponent } from '@shared/ui/radio-checkbox'
import { ErrorListComponent } from '@shared/ui/error-list'
import { SelectionController } from '@shared/behavior/selection'
import {
  RadioCheckboxOption,
  RadioCheckboxOrientation
} from './radio-checkbox-group.model'

let nextId = 0

@Component({
  selector: 'app-radio-checkbox-group',
  templateUrl: './radio-checkbox-group.component.html',
  styleUrl: './radio-checkbox-group.component.scss',
  imports: [RadioCheckboxComponent, ErrorListComponent],
  host: {
    '[class.--horizontal]': 'orientation() === "horizontal"'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioCheckboxGroupComponent<
  T extends string | number
> implements FormValueControl<T | null> {
  public readonly value = model<T | null>(null)

  public readonly disabled = input<boolean>(false)
  public readonly readonly = input<boolean>(false)
  public readonly invalid = input<boolean>(false)
  public readonly touched = input<boolean>(false)
  public readonly errors = input<
    readonly WithOptionalFieldTree<ValidationError>[]
  >([])

  public readonly options = input.required<readonly RadioCheckboxOption<T>[]>()
  public readonly orientation = input<RadioCheckboxOrientation>('vertical')
  public readonly label = input<string>()
  public readonly hint = input<string>()

  public readonly touch = output<void>()

  private readonly _instanceId = nextId++
  protected readonly nameId = `radio-checkbox-group-${this._instanceId}`
  protected readonly labelId = `${this.nameId}-label`
  protected readonly hintId = `${this.nameId}-hint`
  protected readonly errorId = `${this.nameId}-error`

  private readonly _selectedIds = computed<readonly T[]>(() => {
    const v = this.value()
    return v == null ? [] : [v]
  })

  protected readonly selection = new SelectionController<T>({
    multiple: (): boolean => false,
    selectedIds: (): readonly T[] => this._selectedIds(),
    onChange: (ids): void => this.value.set(ids[0] ?? null)
  })

  protected readonly describedBy = computed(() => {
    const ids: string[] = []
    if (this.hint()) ids.push(this.hintId)
    if (this.invalid() && this.touched() && this.errors().length) {
      ids.push(this.errorId)
    }
    return ids.length ? ids.join(' ') : null
  })

  protected optionId(id: T): string {
    return `${this.nameId}-option-${id}`
  }

  protected onOptionSelected(option: RadioCheckboxOption<T>): void {
    if (this.disabled() || this.readonly() || option.disabled) return
    this.selection.select(option.id)
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null
    const host = event.currentTarget as HTMLElement
    if (!next || !host.contains(next)) {
      this.touch.emit()
    }
  }

  protected getTabIndex(option: RadioCheckboxOption<T>): number {
    if (this.disabled()) return -1
    if (this.selection.isSelected(option.id)) return 0

    const hasSelected = this._selectedIds().length > 0
    if (
      !hasSelected &&
      this.options().indexOf(option) === 0 &&
      !option.disabled
    ) {
      return 0
    }

    return -1
  }
}
