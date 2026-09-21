import {
  Component,
  ChangeDetectionStrategy,
  input,
  effect,
  contentChildren,
  computed
} from '@angular/core'
import { IconComponent } from '../../icon/icon.component'
import { AccordionComponent } from '../accordion-single/accordion.component'

@Component({
  selector: 'app-accordion-stack',
  templateUrl: 'accordion-stack.component.html',
  styleUrl: 'accordion-stack.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent]
})
export class AccordionStackComponent {
  public readonly title = input.required<string>()
  public readonly expandedAll = input<boolean>(false)

  protected readonly isExpandedSome = computed(() =>
    this._accordions().some(a => a.expanded())
  )

  private readonly _accordions = contentChildren(AccordionComponent)

  constructor() {
    effect(() => {
      this._accordions().forEach(a => a.stackMode.set(true))
    })

    effect(() => {
      const open = this.expandedAll()
      this._applyToAll(open)
    })
  }

  protected toggleExpanded(): void {
    this._applyToAll(!this.isExpandedSome())
  }

  private _applyToAll(expanded: boolean): void {
    const accordions = this._accordions()
    if (!accordions.length) return

    accordions.forEach(a => {
      if (!a.disabled()) {
        a.expanded.set(expanded)
      }
    })
  }
}
