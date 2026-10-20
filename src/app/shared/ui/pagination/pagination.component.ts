import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model
} from '@angular/core'
import { PageItem } from './pagination.model'
import { PaginationButtonComponent } from './pagination-button/pagination-button.component'

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaginationButtonComponent]
})
export class PaginationComponent {
  public readonly totalItems = input.required<number>()
  public readonly pageSizeOptions = input<number[]>([4, 8, 12, 24])
  public readonly visiblePages = input(5)

  public readonly currentPage = model(1)
  public readonly pageSize = model(12)

  public readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.pageSize()))
  )

  public readonly startItem = computed(() => {
    if (this.totalItems() === 0) return 0
    return (this.currentPage() - 1) * this.pageSize() + 1
  })

  public readonly endItem = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.totalItems())
  )

  public readonly items = computed<PageItem[]>(() => {
    const total = this.totalPages()
    const current = this.currentPage()
    const size = Math.min(this.visiblePages(), total)

    if (total <= size + 1) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    let start = current - Math.floor(size / 2)
    let end = start + size - 1

    if (start < 1) {
      start = 1
      end = size
    }
    if (end > total) {
      end = total
      start = total - size + 1
    }
    if (start === 2) {
      start = 1
      end = size
    }
    if (end === total - 1) {
      end = total
      start = total - size + 1
    }

    const result: PageItem[] = []

    if (start > 1) {
      result.push(1)
      if (start > 2) result.push('ellipsis-start')
    }

    for (let i = start; i <= end; i++) result.push(i)

    if (end < total) {
      if (end < total - 1) result.push('ellipsis-end')
      result.push(total)
    }

    return result
  })

  protected isEllipsis(
    item: PageItem
  ): item is 'ellipsis-start' | 'ellipsis-end' {
    return typeof item === 'string'
  }

  protected goTo(page: number): void {
    const clamped = Math.min(Math.max(page, 1), this.totalPages())
    if (clamped === this.currentPage()) return
    this.currentPage.set(clamped)
  }

  protected prev(): void {
    this.goTo(this.currentPage() - 1)
  }

  protected next(): void {
    this.goTo(this.currentPage() + 1)
  }

  protected onPageSizeChange(event: Event): void {
    const size = Number((event.target as HTMLSelectElement).value)
    if (!Number.isFinite(size) || size <= 0) return

    this.pageSize.set(size)
    this.currentPage.set(1)
  }
}
