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
import { OVERLAY_CONFIG, OVERLAY_REF } from '@shared/ui/overlay/tokens'
import { DefaultButtonComponent } from '@shared/ui/default-button'
import { DividerComponent } from '@shared/ui/divider/divider.component'
import { IconComponent } from '@shared/ui/icon/icon.component'
import { ModalAction, ModalConfig, ModalResult } from './models'
import { MODAL_CONFIG, MODAL_REF } from './tokens'

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
export class ModalComponent<C = unknown, D = unknown, R = unknown> {
  private _parentInjector = inject(Injector)
  private _overlayRef = inject(OVERLAY_REF)
  private _injectedConfig = inject<ModalConfig<C, D, R>>(OVERLAY_CONFIG)

  public config = input<ModalConfig<C, D, R>>(this._injectedConfig)
  public onClose = input<(result: ModalResult<R>) => void>()

  protected readonly title = computed(() => this.config().title)
  protected readonly actions = computed(() => this.config().actions ?? [])

  protected readonly contentComponent = computed<Type<unknown> | null>(() => {
    const c = this.config()
    return 'component' in c ? c.component : null
  })

  protected readonly contentComponentInputs = computed<Record<string, unknown>>(
    () => {
      const c = this.config()
      return 'component' in c ? (c.componentInputs ?? {}) : {}
    }
  )

  protected readonly contentTemplate = computed<TemplateRef<unknown> | null>(
    () => {
      const c = this.config()
      return 'template' in c ? c.template : null
    }
  )

  protected readonly contentTemplateContext = computed<unknown>(() => {
    const c = this.config()
    return 'template' in c ? (c.templateContext ?? {}) : {}
  })

  protected bodyInjector = computed(() =>
    Injector.create({
      parent: this._parentInjector,
      providers: [
        { provide: MODAL_CONFIG, useValue: this.config() },
        {
          provide: MODAL_REF,
          useValue: {
            close: (result?: ModalResult<R>): void =>
              this.close(result || { action: 'close' })
          }
        }
      ]
    })
  )

  public close(result: ModalResult<R> = { action: 'close' }): void {
    this.onClose()?.(result)
    this._overlayRef.close()
  }

  protected isDisabled(value: boolean | Signal<boolean> | undefined): boolean {
    if (value === undefined) return false
    return typeof value === 'function' ? value() : value
  }

  protected async onActionClick(action: ModalAction<R, D>): Promise<void> {
    const ctx = (this.config().data ?? {}) as D
    const payload = (await action.onClick?.(ctx)) as R | undefined

    if (action.closeOnClick) {
      this.close({
        action: 'action',
        text: action.text,
        payload
      })
    }
  }
}
