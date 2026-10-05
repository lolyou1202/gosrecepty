import { Directive, input, model } from '@angular/core'
import { FormValueControl } from '@angular/forms/signals'
import { SelectableItem } from './selection.model'

@Directive({
  selector: '[appSelectionGroup]',
  exportAs: 'selectionGroup'
})
export class SelectionGroupDirective<
  T extends SelectableItem
> implements FormValueControl<T | T[] | null> {
  public readonly multiple = input<boolean>(false)

  public readonly value = model<T | T[] | null>(null)
  public readonly touched = model<boolean>(false)

  public isSelected(id: string): boolean {
    const current = this.value()

    if (Array.isArray(current)) {
      return current.some(i => i.id === id)
    }

    return current?.id === id
  }

  public toggle(item: T, checked: boolean): void {
    const current = this.value()

    const items: T[] =
      current == null ? [] : Array.isArray(current) ? current : [current]

    const alreadyIn = items.some(i => i.id === item.id)
    if (alreadyIn === checked) return

    const without = items.filter(i => i.id !== item.id)

    if (this.multiple()) {
      this.value.set(checked ? [...without, item] : without)
    } else {
      this.value.set(checked ? item : null)
    }

    this.touched.set(true)
  }
}
