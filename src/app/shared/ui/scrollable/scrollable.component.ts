import {
  Component,
  ElementRef,
  viewChild,
  signal,
  afterNextRender,
  input,
  OnDestroy
} from '@angular/core'
import { IconComponent } from '../icon/icon.component'

/* погрешность для float-расчётов и субпиксельного рендеринга */
const SCROLL_EPSILON = 1

@Component({
  selector: 'app-scrollable',
  templateUrl: './scrollable.component.html',
  styleUrl: './scrollable.component.scss',
  imports: [IconComponent]
})
export class ScrollableComponent implements OnDestroy {
  public readonly scrollAmount = input<number>(200)
  public readonly arrowOffset = input<string>('-16px')

  public readonly track = viewChild.required<ElementRef<HTMLElement>>('track')

  protected canScrollLeft = signal(false)
  protected canScrollRight = signal(false)

  private _resizeObserver?: ResizeObserver
  private _abortController = new AbortController()

  constructor() {
    afterNextRender(() => {
      this._updateScrollState()
      this._initResizeObserver()
      this._initScrollListener()
    })
  }

  public ngOnDestroy(): void {
    this._resizeObserver?.disconnect()
    this._abortController.abort()
  }

  private _updateScrollState(): void {
    const el = this.track()?.nativeElement
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el

    this.canScrollLeft.set(scrollLeft > SCROLL_EPSILON)
    this.canScrollRight.set(
      scrollLeft + clientWidth < scrollWidth - SCROLL_EPSILON
    )
  }

  private _initResizeObserver(): void {
    const el = this.track()?.nativeElement
    if (!el) return

    this._resizeObserver = new ResizeObserver(() => this._updateScrollState())
    this._resizeObserver.observe(el)
  }

  private _initScrollListener(): void {
    const el = this.track()?.nativeElement
    if (!el) return

    el.addEventListener('scroll', () => this._updateScrollState(), {
      passive: true,
      signal: this._abortController.signal
    })
  }

  protected scroll(direction: 'left' | 'right'): void {
    const el = this.track()?.nativeElement
    if (!el) return

    const delta =
      direction === 'left' ? -this.scrollAmount() : this.scrollAmount()
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }
}
