import { Directive, effect, input, model } from '@angular/core'

@Directive({
  selector: '[appSelectionGroup]',
  exportAs: 'selectionGroup'
})
export class SelectionGroupDirective<T extends { id: string }> {
  public readonly multiple = input<boolean>(false)

  public readonly value = model<T[]>([])

  constructor() {
    effect(() => {
      if (!this.multiple() && this.value().length > 1) {
        this.value.update(v => v.slice(0, 1))
      }
    })
  }

  public isSelected(id: string): boolean {
    return this.value().some(i => i.id === id)
  }

  public select(item: T): void {
    if (!this.multiple()) {
      this.value.set([item])
      return
    }
    if (this.isSelected(item.id)) return
    this.value.update(v => [...v, item])
  }

  public deselect(item: T): void {
    this.value.update(v => v.filter(i => i.id !== item.id))
  }

  public toggle(item: T): void {
    if (this.isSelected(item.id)) {
      this.deselect(item)
    } else {
      this.select(item)
    }
  }

  public clear(): void {
    this.value.set([])
  }
}
