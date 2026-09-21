import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild
} from '@angular/core'
import { DropdownInputItem, WidthVariant } from './dropdown-input.model'
import { IconComponent } from '../../ui/icon/icon.component'
import { TooltipDirective } from '../tooltip/tooltip.directive'
import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree
} from '@angular/forms/signals'
import { DropdownnComponent } from '../../ui/dropdown/dropdown.component'
import { PillComponent } from '../../ui/pill/pill.component'

@Component({
  selector: 'app-dropdown-input',
  imports: [IconComponent, TooltipDirective, DropdownnComponent, PillComponent],
  templateUrl: './dropdown-input.component.html',
  styleUrl: './dropdown-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class DropdownInputComponent implements FormValueControl<
  DropdownInputItem | DropdownInputItem[] | null
> {
  protected dropdownField = viewChild<ElementRef<HTMLElement>>('dropdownField')
  protected dropdown = viewChild<ElementRef<HTMLElement>>('dropdown')

  public readonly items = input<DropdownInputItem[]>([])
  public readonly width = input<WidthVariant>('default')
  public readonly multiple = input<boolean>(false)
  public readonly hint = input<string>()
  public readonly label = input<string>()
  public readonly placeholder = input<string>('Не выбрано')
  public readonly showChips = input<boolean>(true)
  public readonly maxVisibleChips = input<number>(5)
  public readonly disabled = input<boolean>(false)
  public readonly invalid = input<boolean>(false)
  public readonly errors = input<
    readonly WithOptionalFieldTree<ValidationError>[]
  >([])

  public readonly value = model<DropdownInputItem | DropdownInputItem[] | null>(
    null
  )
  public readonly touched = model<boolean>(false)

  public readonly opened = output<void>()
  public readonly closed = output<void>()

  public ngOnInit(): void {
    if (this.multiple() && !Array.isArray(this.value())) {
      this.value.set([])
    }
  }

  protected readonly isOpen = signal<boolean>(false)

  protected readonly errorMessages = computed(() =>
    this.errors()
      .map(error => error.message)
      .filter((msg): msg is string => !!msg)
  )

  protected readonly displayValue = computed(() => {
    const val = this.value()

    if (!val) {
      return this.placeholder()
    }

    if (this.multiple() && Array.isArray(val)) {
      if (val.length === 0) {
        return this.placeholder()
      }
      return `Выбрано: ${val.length}`
    }

    const singleVal = val as DropdownInputItem
    return singleVal.value || this.placeholder()
  })

  protected readonly selectedItems = computed(() => {
    const val = this.value()
    if (!val) return []

    if (this.multiple() && Array.isArray(val)) {
      return val
    }
    return []
  })

  protected readonly showPlaceholder = computed(() => {
    const val = this.value()
    if (!val) return true

    if (this.multiple() && Array.isArray(val)) {
      return val.length === 0
    }
    return false
  })

  protected readonly visibleChips = computed(() => {
    const items = this.selectedItems()
    const max = this.maxVisibleChips()

    return items.slice(0, max)
  })

  protected readonly preparedItems = computed(() => {
    const val = this.value()
    const items = this.items()

    if (this.multiple() && Array.isArray(val)) {
      const selectedIds = val.map(item => item.id)

      return items.map(item => ({
        ...item,
        selected: selectedIds.includes(item.id)
      }))
    }

    const singleVal = val as DropdownInputItem | null
    return items.map(item => ({
      ...item,
      selected: singleVal?.id === item.id
    }))
  })

  protected removeChip(id: string): void {
    if (!this.multiple() || !Array.isArray(this.value())) return

    const currentValue = this.value() as DropdownInputItem[]
    const updatedValue = currentValue.filter(v => v.id !== id)

    this.value.set(updatedValue)
    this.touched.set(true)
  }

  public open(): void {
    if (this.disabled() || this.isOpen()) return
    this.isOpen.set(true)
    this.opened.emit()
  }

  public close(): void {
    if (this.isOpen() === false) return
    this.isOpen.set(false)
    this.touched.set(true)
    this.closed.emit()
  }

  public toggle(): void {
    this.isOpen() ? this.close() : this.open()
  }

  public onItemClick(id: string | null): void {
    if (id === null) {
      this.value.set(null)
      this.close()
      return
    }

    const item = this.items().find(i => i.id === id)
    if (!item) return

    if (this.multiple() && Array.isArray(this.value())) {
      this._toggleMulti(item)
    } else {
      this._selectSingle(item)
    }
  }

  private _selectSingle(item: DropdownInputItem): void {
    const current = this.value() as DropdownInputItem | null

    if (current?.id === item.id) {
      this.value.set(null)
    } else {
      this.value.set(item)
    }

    this.close()
  }

  private _toggleMulti(item: DropdownInputItem): void {
    const current = (this.value() as DropdownInputItem[]) || []
    const index = current.findIndex(i => i.id === item.id)

    if (index >= 0) {
      const updated = [...current]
      updated.splice(index, 1)
      this.value.set(updated)
    } else {
      this.value.set([...current, item])
    }
  }

  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    const dropdown = this.dropdown()?.nativeElement
    const dropdownField = this.dropdownField()?.nativeElement

    if (dropdownField?.contains(target) || dropdownField === target) {
      this.onFieldClick()
      return
    }

    if (dropdown?.contains(target)) return

    this.close()
  }

  protected onFieldClick(): void {
    if (this.disabled()) return
    this.toggle()
  }
}
