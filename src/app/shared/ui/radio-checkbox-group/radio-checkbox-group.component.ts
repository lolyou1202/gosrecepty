import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChildren
} from '@angular/core'
import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree
} from '@angular/forms/signals'
import {
  RadioCheckboxOption,
  RadioCheckboxOrientation
} from './radio-checkbox-group.model'
import { RadioCheckboxComponent } from '../radio-checkbox'
import { SelectionController } from '@shared/behavior/selection/selection-controller'
import { ErrorListComponent } from '../error-list'

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
  public readonly withDeselect = input<boolean>(false)

  public readonly touch = output<void>()

  private readonly _idPrefix = `radio-checkbox-group-${nextId++}`
  protected readonly labelId = `${this._idPrefix}-label`
  protected readonly hintId = `${this._idPrefix}-hint`
  protected readonly errorId = `${this._idPrefix}-error`

  private readonly _focusedIndex = signal<number | null>(null)
  private readonly _itemRefs = viewChildren(RadioCheckboxComponent, {
    read: ElementRef
  })

  private readonly _selectedIds = computed<readonly T[]>(() => {
    const v = this.value()
    return v == null ? [] : [v]
  })

  protected readonly errorMessages = computed(() =>
    this.errors()
      .map(e => e.message)
      .filter((m): m is string => !!m)
  )

  protected readonly describedBy = computed(() => {
    const ids: string[] = []
    if (this.hint()) ids.push(this.hintId)
    if (this.invalid() && this.touched() && this.errorMessages().length) {
      ids.push(this.errorId)
    }
    return ids.length ? ids.join(' ') : null
  })

  protected readonly activeIndex = computed(() => {
    const f = this._focusedIndex()
    if (f !== null) return f
    const v = this.value()
    if (v != null) {
      const idx = this.options().findIndex(o => o.id === v)
      if (idx >= 0) return idx
    }
    return 0
  })

  protected readonly selection = new SelectionController<T>({
    multiple: (): boolean => false,
    withDeselect: (): boolean => this.withDeselect(),
    selectedIds: (): readonly T[] => this._selectedIds(),
    onChange: (ids): void => this.value.set(ids[0] ?? null)
  })

  protected optionId(id: T): string {
    return `${this._idPrefix}-option-${id}`
  }

  protected getTabindex(index: number): number {
    if (this.disabled()) return -1
    return index === this.activeIndex() ? 0 : -1
  }

  protected onFocusIn(index: number): void {
    this._focusedIndex.set(index)
  }

  protected onOptionSelected(index: number): void {
    if (this.disabled() || this.readonly()) return
    this._select(index)
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    if (this.disabled() || this.readonly()) return

    const count = this.options().length
    let next: number | null = null

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = (index + 1) % count
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        next = (index - 1 + count) % count
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = count - 1
        break
      case ' ':
      case 'Enter':
        event.preventDefault()
        this._select(index)
        return
      default:
        return
    }
    event.preventDefault()

    if (next !== null && next !== index) {
      this._focusedIndex.set(next)
      this._focusItem(next)
    }
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null
    const host = event.currentTarget as HTMLElement
    if (!next || !host.contains(next)) {
      this.touch.emit()
      this._focusedIndex.set(null)
    }
  }

  private _select(index: number): void {
    const option = this.options()[index]
    if (!option || option.disabled) return
    this.selection.toggle(option.id)
  }

  private _focusItem(index: number): void {
    const el = this._itemRefs()[index]?.nativeElement as HTMLElement | undefined
    el?.focus()
  }
}
