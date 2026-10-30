import { Directive, effect, input, model } from '@angular/core'

@Directive({
  selector: '[appSelectionGroup]',
  exportAs: 'selectionGroup'
})
export class SelectionGroupDirective<T extends string> {
  public readonly multiple = input<boolean>(false)

  public readonly value = model<T[]>([])

  constructor() {
    effect(() => {
      if (!this.multiple() && this.value().length > 1) {
        this.value.update(v => v.slice(0, 1))
      }
    })
  }

  public isSelected(id: T): boolean {
    return this.value().some(i => i === id)
  }

  public select(id: T): void {
    if (!this.multiple()) {
      this.value.set([id])
      return
    }
    if (this.isSelected(id)) return
    this.value.update(v => [...v, id])
  }

  public deselect(id: T): void {
    this.value.update(v => v.filter(i => i !== id))
  }

  public toggle(id: T): void {
    if (this.isSelected(id)) {
      this.deselect(id)
    } else {
      this.select(id)
    }
  }

  public clear(): void {
    this.value.set([])
  }
}
