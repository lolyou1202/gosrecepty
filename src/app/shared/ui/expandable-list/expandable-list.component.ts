import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  signal,
  viewChild
} from '@angular/core'
import { LayoutService } from '@shared/services/layout.service'
import { ExpandableItemDirective } from './expandable-item.directive'

@Component({
  selector: 'app-expandable-list',
  templateUrl: './expandable-list.component.html',
  styleUrl: './expandable-list.component.scss',
  host: {
    '[class.--expanded]': 'isCollapsible() && expanded()',
    '[class.--collapsible]': 'isCollapsible()',
    '[style.--expandable-list-gap]': 'gapStyle()',
    '[class.scrollable-mobile]': 'scrollableOnMobile() && isMobile()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpandableListComponent {
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly _destroyRef = inject(DestroyRef)
  private readonly _layout = inject(LayoutService)

  private readonly _moreMeasurerRef =
    viewChild<ElementRef<HTMLElement>>('moreMeasurer')

  private readonly _items = contentChildren(ExpandableItemDirective, {
    descendants: false
  })

  public readonly collapsible = input<boolean>(true)
  public readonly scrollableOnMobile = input<boolean>(true)
  public readonly expanded = model(false)
  public readonly gap = input<number>(8)

  public readonly hasOverflow = signal(false)
  public readonly hiddenCount = signal(0)

  protected readonly isMobile = computed(() => this._layout.isMobile())

  protected readonly isCollapsible = computed(() => {
    if (!this.collapsible()) return false
    if (this.scrollableOnMobile() && this.isMobile()) return false
    return true
  })

  protected readonly gapStyle = computed(() => `${this.gap()}px`)

  private _hostRO?: ResizeObserver
  private _itemRO?: ResizeObserver
  private _subs = new Set<HTMLElement>()
  private _rafId = 0

  constructor() {
    afterNextRender(() => this._syncHostObserver())

    effect(() => {
      const items = this._items()
      const expanded = this.expanded()
      const collapsible = this.isCollapsible()
      void this.gap()

      this._syncHostObserver()

      if (!collapsible) {
        this._hostRO?.disconnect()
        this._hostRO = undefined
        this._itemRO?.disconnect()
        this._itemRO = undefined
        this._subs.clear()

        for (const it of items) it.setVisible(true)
        this.hasOverflow.set(false)
        this.hiddenCount.set(0)
        if (expanded) this.expanded.set(false)
        return
      }

      this._syncItemObservers(items)

      if (expanded) {
        for (const it of items) it.setVisible(true)
        this.hasOverflow.set(false)
        this.hiddenCount.set(0)
        return
      }

      this._measure()
    })

    this._destroyRef.onDestroy(() => {
      this._hostRO?.disconnect()
      this._itemRO?.disconnect()
      cancelAnimationFrame(this._rafId)
    })
  }

  private _syncItemObservers(items: readonly ExpandableItemDirective[]): void {
    if (!this.isCollapsible()) return

    if (!this._itemRO) {
      this._itemRO = new ResizeObserver(() => this._schedule())
    }
    const next = new Set(items.map(i => i.element))
    for (const el of this._subs) {
      if (!next.has(el)) {
        this._itemRO.unobserve(el)
        this._subs.delete(el)
      }
    }
    for (const el of next) {
      if (!this._subs.has(el)) {
        this._itemRO.observe(el)
        this._subs.add(el)
      }
    }
  }

  private _schedule(): void {
    cancelAnimationFrame(this._rafId)
    this._rafId = requestAnimationFrame(() => this._measure())
  }

  private _measure(): void {
    if (!this.isCollapsible()) return

    const items = this._items()
    const host = this._host.nativeElement

    if (this.expanded()) {
      for (const it of items) it.setVisible(true)
      this.hasOverflow.set(false)
      this.hiddenCount.set(0)
      return
    }

    if (!items.length) {
      this.hasOverflow.set(false)
      this.hiddenCount.set(0)
      return
    }

    const containerWidth = host.clientWidth
    if (containerWidth === 0) {
      this._schedule()
      return
    }

    for (const it of items) it.setVisible(true)
    void host.offsetWidth

    const gap = this._getColumnGap(host)
    const moreButtonWidth =
      this._moreMeasurerRef()?.nativeElement.offsetWidth ?? 0

    const itemWidths = items.map(it => it.element.offsetWidth)

    const totalItemsWidth =
      itemWidths.reduce((sum, w) => sum + w, 0) + gap * (itemWidths.length - 1)

    if (totalItemsWidth <= containerWidth) {
      this.hasOverflow.set(false)
      this.hiddenCount.set(0)
      return
    }

    const availableForItems = containerWidth - moreButtonWidth - gap

    let accumulated = 0
    let visible = 0
    for (let i = 0; i < itemWidths.length; i++) {
      const add = itemWidths[i] + (i > 0 ? gap : 0)
      if (accumulated + add > availableForItems) break
      accumulated += add
      visible++
    }
    visible = Math.max(visible, 1)

    this._applyVisible(items, visible)
    void host.offsetWidth

    while (visible > 1 && host.scrollWidth > host.clientWidth + 1) {
      visible--
      this._applyVisible(items, visible)
      void host.offsetWidth
    }

    this.hasOverflow.set(true)
    this.hiddenCount.set(items.length - visible)
  }

  private _syncHostObserver(): void {
    const collapsible = this.isCollapsible()
    const host = this._host.nativeElement

    if (collapsible && !this._hostRO) {
      this._hostRO = new ResizeObserver(() => this._schedule())
      this._hostRO.observe(host)
      this._schedule()
    } else if (!collapsible && this._hostRO) {
      this._hostRO.disconnect()
      this._hostRO = undefined
    }
  }

  private _applyVisible(
    items: readonly ExpandableItemDirective[],
    visible: number
  ): void {
    for (let i = 0; i < items.length; i++) {
      items[i].setVisible(i < visible)
    }
  }

  private _getColumnGap(el: HTMLElement): number {
    const g = getComputedStyle(el).columnGap
    if (!g || g === 'normal') return 0
    return parseFloat(g) || 0
  }
}
