import {
  EnvironmentInjector,
  Injectable,
  Injector,
  Type,
  inject,
  signal
} from '@angular/core'
import { firstValueFrom, catchError, of } from 'rxjs'
import {
  Overlay as CdkOverlay,
  OverlayPositionBuilder
} from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import type { ComponentInputValues } from '@shared/utils/types'
import { createOverlayRef } from './ref'
import { buildCdkOverlayConfig } from './config'
import { OverlayFocusManager } from './focus'
import { OverlayAnimationPlayer } from './animation'
import { OVERLAY_CONFIG, OVERLAY_REF } from './tokens'
import type { OverlayConfig, OverlayRef } from './models'

@Injectable({ providedIn: 'root' })
export class OverlayService {
  private readonly _cdkOverlay = inject(CdkOverlay)
  private readonly _injector = inject(EnvironmentInjector)
  private readonly _animations = inject(OverlayAnimationPlayer)
  private readonly _focus = inject(OverlayFocusManager)

  private readonly _stack = signal<{ id: string; ref: OverlayRef }[]>([])

  public create<T>({
    component,
    config,
    initialInputs
  }: {
    component: Type<T>
    config: OverlayConfig
    initialInputs?: ComponentInputValues<T>
  }): OverlayRef {
    const id = `overlay_${this._generateId()}`
    const cdkRef = this._cdkOverlay.create(
      buildCdkOverlayConfig(this._cdkOverlay, config)
    )

    try {
      const ref = createOverlayRef(
        cdkRef,
        id,
        config,
        this._animations,
        this._focus
      )

      const injector = Injector.create({
        providers: [
          { provide: OVERLAY_REF, useValue: ref },
          { provide: OVERLAY_CONFIG, useValue: config }
        ],
        parent: this._injector
      })

      const componentRef = cdkRef.attach(
        new ComponentPortal(component, null, injector)
      )

      if (initialInputs) {
        for (const key of Object.keys(initialInputs) as (keyof T & string)[]) {
          componentRef.setInput(key, initialInputs[key])
        }
      }

      this._animations.playOpening(cdkRef, config)
      ref.focusInitialElement()

      ref.closed$.subscribe(() => this._removeFromStack(id))
      this._stack.update(stack => [...stack, { id, ref }])
      if (ref.isClosed) this._removeFromStack(id)

      return ref
    } catch (e) {
      cdkRef.dispose()
      throw e
    }
  }

  public position(): OverlayPositionBuilder {
    return this._cdkOverlay.position()
  }

  public async closeAll(): Promise<void> {
    const refs = [...this._stack()].reverse().map(({ ref }) => ref)
    if (!refs.length) return

    const waits = refs.map(ref => {
      ref.close()
      return firstValueFrom(ref.closed$.pipe(catchError(() => of(undefined))))
    })

    await Promise.all(waits)
  }

  private _removeFromStack(id: string): void {
    this._stack.update(stack => stack.filter(el => el.id !== id))
  }

  private _generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).slice(2)}`
  }
}
