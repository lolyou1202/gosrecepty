import {
  Component,
  inject,
  ChangeDetectionStrategy,
  TemplateRef,
  input,
  Type,
  Injector,
  computed,
  Signal
} from '@angular/core'
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common'
import { OVERLAY_REF } from '@shared/ui/overlay/tokens'
import { DefaultButtonComponent } from '@shared/ui/default-button'
import { DividerComponent } from '@shared/ui/divider/divider.component'
import { IconComponent } from '@shared/ui/icon/icon.component'
import type { Nullable } from '@shared/utils/types'
import type { ModalAction, ModalConfig } from './models'
import { MODAL_CONFIG, MODAL_REF } from './tokens'

let nextId = 0

@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  styleUrl: 'modal.component.scss',
  imports: [
    DefaultButtonComponent,
    DividerComponent,
    IconComponent,
    NgTemplateOutlet,
    NgComponentOutlet
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent<C = unknown, D = unknown> {
  private readonly _parentInjector = inject(Injector)
  private readonly _overlayRef = inject(OVERLAY_REF)

  public readonly config = input<Nullable<ModalConfig<C, D>>>()

  protected readonly titleId = `modal-title-${nextId++}`

  protected readonly title = computed<Nullable<string>>(
    () => this.config()?.title
  )
  protected readonly actions = computed<Nullable<ModalAction[]>>(
    () => this.config()?.actions ?? []
  )

  protected readonly contentComponent = computed<Nullable<Type<C>>>(() => {
    const c = this.config()
    return c && 'component' in c ? c.component : null
  })

  protected readonly contentComponentInputs = computed<Record<string, unknown>>(
    () => {
      const c = this.config()
      return c && 'component' in c ? (c.componentInputs ?? {}) : {}
    }
  )

  protected readonly contentTemplate = computed<Nullable<TemplateRef<C>>>(
    () => {
      const c = this.config()
      return c && 'template' in c ? c.template : null
    }
  )

  protected readonly contentTemplateContext = computed<Nullable<C>>(() => {
    const c = this.config()
    return c && 'template' in c ? (c.templateContext ?? null) : null
  })

  protected bodyInjector = computed(() =>
    Injector.create({
      parent: this._parentInjector,
      providers: [
        { provide: MODAL_CONFIG, useValue: this.config() },
        {
          provide: MODAL_REF,
          useValue: {
            close: (): void => this.close()
          }
        }
      ]
    })
  )

  public close(): void {
    this._overlayRef.close()
  }

  protected isActionDisabled(
    value: Nullable<boolean | Signal<boolean>>
  ): boolean {
    if (value === undefined || value === null) return false
    return typeof value === 'function' ? value() : value
  }

  protected async onActionClick(action: ModalAction): Promise<void> {
    if (action.closeOnClick) {
      this.close()
    }
    action.onClick?.()
  }
}
