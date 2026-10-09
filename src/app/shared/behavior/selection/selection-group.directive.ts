import { Directive, input, model } from '@angular/core'

@Directive({
  selector: '[appSelectionGroup]',
  exportAs: 'selectionGroup'
})
export class SelectionGroupDirective<T extends string | number = string> {
  public readonly multiple = input<boolean>(false, {
    alias: 'selectionGroupMultiple'
  })

  public readonly selectedIds = model<T[]>([], {
    alias: 'selectionGroupIds'
  })

  public isSelected(id: T): boolean {
    return this.selectedIds().some(i => i === id)
  }

  public toggle(id: T, checked: boolean): void {
    const currentIds = this.selectedIds()
    const alreadyIn = currentIds.some(i => i === id)
    if (alreadyIn === checked) return

    const without = currentIds.filter(i => i !== id)

    if (checked) {
      this.selectedIds.set(this.multiple() ? [...without, id] : [id])
    } else {
      this.selectedIds.set(without)
    }
  }
}
