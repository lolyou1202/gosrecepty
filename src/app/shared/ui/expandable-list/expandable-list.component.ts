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
import { ExpandableItemDirective } from './expandable-item.directive'

@Component({
  selector: 'app-expandable-list',
  templateUrl: './expandable-list.component.html',
  styleUrls: ['./expandable-list.component.scss'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpandableListComponent {
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly _destroyRef = inject(DestroyRef)

  private readonly _rowRef = viewChild.required<ElementRef<HTMLElement>>('row')
  private readonly _moreMeasurerRef =
    viewChild<ElementRef<HTMLElement>>('moreMeasurer')

  private readonly items = contentChildren(ExpandableItemDirective, {
    descendants: false
  })

  public readonly collapsible = input<boolean>(true)
  public readonly gap = input<number | string>(8)
  public readonly expanded = model(false)

  public readonly hasOverflow = signal(false)
  public readonly hiddenCount = signal(0)

  protected readonly gapStyle = computed(() => {
    const g = this.gap()
    return typeof g === 'number' ? `${g}px` : g
  })

  private hostRO?: ResizeObserver
  private itemRO?: ResizeObserver
  private moreRO?: ResizeObserver
  private subs = new Set<HTMLElement>()
  private rafId = 0

  constructor() {
    afterNextRender(() => this._syncHostObserver())

    effect(() => {
      const items = this.items()
      const expanded = this.expanded()
      const collapsible = this.collapsible()
      void this.gap()

      this._syncHostObserver()

      if (!collapsible) {
        this.hostRO?.disconnect()
        this.hostRO = undefined
        this.itemRO?.disconnect()
        this.itemRO = undefined
        this.subs.clear()

        for (const it of items) it.setVisible(true)
        this.hasOverflow.set(false)
        this.hiddenCount.set(0)
        if (expanded) this.expanded.set(false)
        return
      }

      this.syncItemObservers(items)

      if (expanded) {
        for (const it of items) it.setVisible(true)
        this.hasOverflow.set(false)
        this.hiddenCount.set(0)
        return
      }

      this.measure()
    })

    this._destroyRef.onDestroy(() => {
      this.hostRO?.disconnect()
      this.itemRO?.disconnect()
      this.moreRO?.disconnect()
      cancelAnimationFrame(this.rafId)
    })
  }

  private syncItemObservers(items: readonly ExpandableItemDirective[]): void {
    if (!this.collapsible()) return

    if (!this.itemRO) {
      this.itemRO = new ResizeObserver(() => this.schedule())
    }
    const next = new Set(items.map(i => i.element))
    for (const el of this.subs) {
      if (!next.has(el)) {
        this.itemRO.unobserve(el)
        this.subs.delete(el)
      }
    }
    for (const el of next) {
      if (!this.subs.has(el)) {
        this.itemRO.observe(el)
        this.subs.add(el)
      }
    }
  }

  private schedule(): void {
    cancelAnimationFrame(this.rafId)
    this.rafId = requestAnimationFrame(() => this.measure())
  }

  private measure(): void {
    if (!this.collapsible()) return

    const items = this.items()

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

    const row = this._rowRef().nativeElement
    const containerWidth = row.clientWidth
    if (containerWidth === 0) {
      this.schedule()
      return
    }

    for (const it of items) it.setVisible(true)
    void row.offsetWidth

    const gap = this._getColumnGap(row)
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
    void row.offsetWidth

    while (visible > 1 && row.scrollWidth > row.clientWidth + 1) {
      visible--
      this._applyVisible(items, visible)
      void row.offsetWidth
    }

    this.hasOverflow.set(true)
    this.hiddenCount.set(items.length - visible)
  }

  private _syncHostObserver(): void {
    const collapsible = this.collapsible()
    const host = this._host.nativeElement

    if (collapsible && !this.hostRO) {
      this.hostRO = new ResizeObserver(() => this.schedule())
      this.hostRO.observe(host)
      this.schedule()
    } else if (!collapsible && this.hostRO) {
      this.hostRO.disconnect()
      this.hostRO = undefined
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
