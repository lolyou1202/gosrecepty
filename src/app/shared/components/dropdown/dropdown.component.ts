import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostBinding,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconComponent } from '../icon/icon.component'
import { NgScrollbarModule } from 'ngx-scrollbar'
import { DropdownItem } from './dropdown.model'

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule, IconComponent, NgScrollbarModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(keydown)': 'onKeyDown($event)',
    '[attr.tabindex]': '-1'
  }
})
export class DropdownnComponent {
  private readonly _elementRef = inject(ElementRef)

  constructor() {
    // Начальный фокус при открытии
    effect(() => {
      if (this.open()) {
        requestAnimationFrame(() => this._elementRef.nativeElement.focus())
      }
    })

    // При изменении списка или режима – сбрасываем подсветку, если она вне границ
    effect(() => {
      this.items()
      this.multiple()
      this.placeholder()

      const current = this.highlighted()
      if (current !== null) {
        const { min, max } = this.navBounds()
        if (current < min || current > max) {
          this.highlighted.set(null)
        }
      }
    })
  }

  public readonly items = input.required<DropdownItem[]>()
  public readonly placeholder = input<string>()
  public readonly multiple = input<boolean>(false)

  public readonly open = model<boolean>(false)

  public readonly selectedItemId = output<string | null>()

  public readonly highlighted = signal<number | null>(null)

  protected readonly selectedIds = computed(
    () =>
      new Set(
        this.items()
          .filter(item => item.selected)
          .map(item => item.id)
      )
  )

  protected readonly navBounds = computed(() => {
    const hasPlaceholder = !!this.placeholder() && !this.multiple()
    const maxIndex = this.items().length
    return {
      min: hasPlaceholder ? 0 : 1,
      max: maxIndex
    }
  })

  public selectItem(id: string): void {
    this.selectedItemId.emit(id)
  }

  public reset(): void {
    this.selectedItemId.emit(null)
  }

  public highlightItem(index: number | null, isMouseEvent?: boolean): void {
    this.highlighted.set(index)

    if (!isMouseEvent && index !== null) {
      this._scrollToHighlighted(index)
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const keysToPrevent = ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ']
    if (keysToPrevent.includes(event.key)) {
      event.preventDefault()
    }

    switch (event.key) {
      case 'ArrowDown':
        this._navigate(1)
        break
      case 'ArrowUp':
        this._navigate(-1)
        break
      case 'Home':
        this._navigate('start')
        break
      case 'End':
        this._navigate('end')
        break
      case 'Enter':
      case ' ':
        const idx = this.highlighted()
        if (idx === null) return
        if (idx === 0) {
          this.reset()
        } else {
          const item = this.items()[idx - 1]
          if (item) {
            this.selectItem(item.id)
          }
        }
        if (!this.multiple()) {
          this.open.set(false)
        }
        break
      case 'Escape':
        this.open.set(false)
        break
    }
  }

  public focus(): void {
    this._elementRef.nativeElement.focus()
  }

  private _navigate(direction: 'start' | 'end' | number): void {
    const items = this.items()
    if (items.length === 0) return

    const { min: minIndex, max: maxIndex } = this.navBounds()

    let current = this.highlighted()

    if (current === null) {
      if (direction === 'start') {
        current = minIndex
      } else if (direction === 'end') {
        current = maxIndex
      } else if (direction === 1) {
        current = minIndex
      } else if (direction === -1) {
        current = maxIndex
      } else {
        current = minIndex
      }
    } else {
      if (direction === 'start') {
        current = minIndex
      } else if (direction === 'end') {
        current = maxIndex
      } else {
        current += direction
      }
    }

    if (current < minIndex) {
      current = maxIndex
    } else if (current > maxIndex) {
      current = minIndex
    }

    this.highlightItem(current)
  }

  private _scrollToHighlighted(index: number): void {
    if (index < 0) return

    requestAnimationFrame(() => {
      const element = this._elementRef.nativeElement.querySelector(
        `[data-index="${index}"]`
      )

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }
    })
  }

  @HostBinding('class')
  protected get hostClass(): string {
    return this.open() ? '--open' : ''
  }
}
