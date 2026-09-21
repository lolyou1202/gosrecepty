import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  computed,
  model
} from '@angular/core'
import cx from 'clsx'
import { TabItem, TabVariant } from './tabs.model'

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.component.html',
  styleUrl: 'tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()'
  }
})
export class TabsComponent {
  public readonly tabs = input.required<TabItem[]>()
  public readonly variant = input<TabVariant>('outside')
  public readonly fullWidth = input<boolean>(false)

  public readonly activeTabIndex = model<number | null>(null)

  private readonly _hoveredTab = signal<number | null>(null)

  protected readonly hostClass = computed(() =>
    cx(`tabs --${this.variant()}`, { 'full-width': this.fullWidth() })
  )

  protected isActive(tabIndex: number): boolean {
    return this.activeTabIndex() === tabIndex
  }

  protected isHovered(tabIndex: number): boolean {
    return this._hoveredTab() === tabIndex
  }

  protected selectTab(tabIndex: number): void {
    const currentTab = this.tabs()[tabIndex]

    if (currentTab && !currentTab.disabled) {
      this.activeTabIndex.set(tabIndex)
    }
    console.log(this.activeTabIndex())
  }

  protected onMouseEnter(tabIndex: number): void {
    const currentTab = this.tabs()[tabIndex]

    if (currentTab && !currentTab.disabled) {
      this._hoveredTab.set(tabIndex)
    }
  }

  protected onMouseLeave(): void {
    this._hoveredTab.set(null)
  }
}
