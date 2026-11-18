import {
  Directive,
  ElementRef,
  NgZone,
  inject,
  DestroyRef,
  afterNextRender,
  input,
  output
} from '@angular/core'
import { Nullable } from '@shared/utils/types'

@Directive({
  selector: '[appDragScroll]'
})
export class DragScrollDirective {
  private readonly _el =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly _ngZone = inject(NgZone)
  private readonly _destroyRef = inject(DestroyRef)

  /** Включить инерцию (плавное скольжение после отпускания) */
  public readonly momentum = input<boolean>(true)
  /** Включить скролл вертикальным колесиком мыши */
  public readonly wheelScroll = input<boolean>(true)

  public readonly dragStart = output<void>()
  public readonly dragEnd = output<void>()

  private isDragging = false
  private activePointerId: Nullable<number> = null
  private startX = 0
  private scrollLeft = 0

  private velocity = 0
  private lastX = 0
  private lastTime = 0
  private animationId = 0

  private hasDragged = false

  constructor() {
    afterNextRender(() => {
      this._ngZone.runOutsideAngular(() => this._init())
    })
  }

  private _init(): void {
    const el = this._el

    const onPointerDown = (e: PointerEvent): void => {
      // Игнорируем правую кнопку мыши и мультитач
      if (e.button !== 0 || this.activePointerId !== null) return

      this.activePointerId = e.pointerId
      this.isDragging = true
      this.hasDragged = false

      // Меняем курсор напрямую (в обход Angular)
      el.style.cursor = 'grabbing'
      el.style.userSelect = 'none'

      this.startX = e.clientX
      this.scrollLeft = el.scrollLeft
      this.lastX = e.clientX
      this.lastTime = performance.now()
      this.velocity = 0

      cancelAnimationFrame(this.animationId)

      // Захватываем указатель, чтобы не потерять его при выходе за края
      el.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent): void => {
      if (!this.isDragging || e.pointerId !== this.activePointerId) return

      // Защита от случайных микро-сдвигов (если рука дрогнула)
      const walk = e.clientX - this.startX
      if (Math.abs(walk) > 3) {
        this.hasDragged = true
        // Предотвращаем выделение текста при перетаскивании
        e.preventDefault()
      } else {
        return
      }

      el.scrollLeft = this.scrollLeft - walk

      // Расчет скорости для инерции
      const now = performance.now()
      const dt = now - this.lastTime
      if (dt > 0) {
        this.velocity = (e.clientX - this.lastX) / dt
      }
      this.lastX = e.clientX
      this.lastTime = now
    }

    const onPointerUp = (e: PointerEvent): void => {
      if (!this.isDragging || e.pointerId !== this.activePointerId) return

      this.isDragging = false
      this.activePointerId = null
      el.releasePointerCapture(e.pointerId)

      // Возвращаем стили
      el.style.cursor = 'grab'
      el.style.userSelect = ''

      if (this.hasDragged) {
        this.dragEnd.emit()

        if (this.momentum()) {
          this._applyMomentum()
        }

        // Разрешаем клик только после того, как событие click полностью отработает
        setTimeout(() => {
          this.hasDragged = false
        }, 50)
      }
    }

    // Блокируем случайные клики, если произошел drag
    const onClickCapture = (e: MouseEvent): void => {
      if (this.hasDragged) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const onWheel = (e: WheelEvent): void => {
      if (!this.wheelScroll()) return

      // Переводим вертикальный скролл в горизонтальный
      if (e.deltaY !== 0) {
        e.preventDefault()
        // Умножаем на 1.5 для более комфортной скорости на десктопе
        el.scrollLeft += e.deltaY * 1.5
      }
    }

    el.style.cursor = 'grab'

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove, { passive: false })
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    el.addEventListener('click', onClickCapture, true)
    el.addEventListener('wheel', onWheel, { passive: false })

    this._destroyRef.onDestroy(() => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      el.removeEventListener('click', onClickCapture, true)
      el.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(this.animationId)
    })
  }

  private _applyMomentum(): void {
    const el = this._el
    const friction = 0.93 // Чем меньше, тем быстрее останавливается

    const step = (): void => {
      // Останавливаемся, если скорость упала
      if (Math.abs(this.velocity) < 0.1) return

      el.scrollLeft -= this.velocity * 16 // 16ms ~ 1 кадр

      // Останавливаем инерцию, если доскроллили до края
      if (
        el.scrollLeft <= 0 ||
        el.scrollLeft >= el.scrollWidth - el.clientWidth
      ) {
        this.velocity = 0
        return
      }

      this.velocity *= friction
      this.animationId = requestAnimationFrame(step)
    }

    this.animationId = requestAnimationFrame(step)
  }
}
