import { Directive, input, model } from '@angular/core'

@Directive({
  selector: '[appSelectionGroup]',
  exportAs: 'selectionGroup'
})
export class SelectionGroupDirective<T extends string | number> {
  public readonly multiple = input<boolean>(false)
  public readonly withDeselect = input<boolean>(false)

  public readonly value = model<T[]>([])

  public readonly isSelected = (id: T): boolean => {
    return this.value().includes(id)
  }

  public readonly select = (id: T): void => {
    if (this.multiple()) {
      if (this.isSelected(id)) return
      this.value.set([...this.value(), id])
      return
    }
    this.value.set([id])
  }

  public readonly deselect = (id: T): void => {
    if (!this.isSelected(id)) return
    if (!this.multiple() && !this.withDeselect()) return
    this.value.set(this.value().filter(i => i !== id))
  }

  public readonly toggle = (id: T): void => {
    if (this.isSelected(id)) {
      this.deselect(id)
    } else {
      this.select(id)
    }
  }

  public readonly clear = (): void => {
    this.value.set([])
  }
}
