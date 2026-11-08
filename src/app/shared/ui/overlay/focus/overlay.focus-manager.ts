import { Injectable, NgZone, inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import {
  ConfigurableFocusTrap,
  ConfigurableFocusTrapFactory,
  FocusMonitor
} from '@angular/cdk/a11y'
import { FocusSnapshot } from '../models'

@Injectable({ providedIn: 'root' })
export class OverlayFocusManager {
  private readonly _focusTrapFactory = inject(ConfigurableFocusTrapFactory)
  private readonly _focusMonitor = inject(FocusMonitor)
  private readonly _ngZone = inject(NgZone)
  private readonly _document = inject(DOCUMENT)

  public capture(): FocusSnapshot {
    const active = this._document.activeElement
    return { element: active instanceof HTMLElement ? active : null }
  }

  /** Создает трап (вешает слушатели). Вызывается ДО attach. */
  public createTrap(hostElement: HTMLElement): ConfigurableFocusTrap {
    return this._focusTrapFactory.create(hostElement)
  }

  /*** Фокусирует первый элемент. Вызывается ПОСЛЕ attach. */
  public focusInitial(
    trap: ConfigurableFocusTrap | null,
    host: HTMLElement
  ): void {
    this._ngZone.runOutsideAngular(() => {
      if (trap) {
        trap.focusInitialElement()
      } else {
        host.focus()
      }
    })
  }

  /** Возвращает фокус на элемент, который был активен до открытия. */
  public restore(
    snapshot: FocusSnapshot,
    trap: ConfigurableFocusTrap | null
  ): void {
    trap?.destroy()

    const previous = snapshot.element
    if (!previous || !previous.isConnected) return

    const active = this._document.activeElement
    if (active && active !== this._document.body && active !== previous) {
      return
    }

    this._ngZone.runOutsideAngular(() => {
      this._focusMonitor.focusVia(previous, 'program')
    })
  }
}
