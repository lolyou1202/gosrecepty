import { Directive, effect, inject, input, untracked } from '@angular/core'
import { SelectableItem } from './selection.model'
import { SELECTABLE_CONTROL } from './selection.token'
import { SelectionGroupDirective } from './selection-group.directive'

@Directive({
  selector: '[appSelectableItem]'
})
export class SelectableItemDirective<T extends SelectableItem> {
  private readonly control = inject(SELECTABLE_CONTROL)
  private readonly group = inject<SelectionGroupDirective<T>>(
    SelectionGroupDirective
  )

  public readonly item = input.required<T>({ alias: 'appSelectableItem' })

  constructor() {
    // Группа -> контрол. Зависит от value группы и item.
    effect(() => {
      const selected = this.group.isSelected(this.item().id)

      untracked(() => {
        if (this.control.checked() !== selected) {
          this.control.checked.set(selected)
        }
      })
    })

    // Контрол -> группа. Зависит ТОЛЬКО от checked контрола.
    // isSelected читаем untracked, чтобы не реагировать на изменения группы.
    effect(() => {
      const checked = this.control.checked()
      const item = untracked(this.item)
      const inGroup = untracked(() => this.group.isSelected(item.id))

      if (checked === inGroup) return
      untracked(() => this.group.toggle(item, checked))
    })
  }
}
