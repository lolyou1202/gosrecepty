import {
  Component,
  inject,
  ChangeDetectionStrategy,
  TemplateRef,
  input,
  Type,
  Injector,
  output,
  computed,
  Signal
} from '@angular/core'
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ModalAction, ModalConfig, ModalResult } from './modal.model'
import { MODAL_CONFIG, MODAL_REF } from './modal.tokens'
import { DefaultButtonComponent } from '../default-button'
import { DividerComponent } from '../divider/divider.component'
import { IconComponent } from '../icon/icon.component'

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
export class ModalComponent<D = unknown, R = unknown> {
  private _dialogRef = inject(
    MatDialogRef<ModalComponent<D, R>, ModalResult<R>>
  )
  private _parentInjector = inject(Injector)
  private _config = inject<ModalConfig<unknown, D, R>>(MAT_DIALOG_DATA)

  public config = input<ModalConfig<unknown, D, R>>(this._config)
  public closed = output<ModalResult<R>>()

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
        { provide: MODAL_REF, useValue: this._dialogRef }
      ]
    })
  )

  public close(result: ModalResult<R> = { action: 'close' }): void {
    this._dialogRef.close(result)
    this.closed.emit(result)
  }

  protected isDisabled(value: boolean | Signal<boolean> | undefined): boolean {
    if (value === undefined) return false
    return typeof value === 'function' ? value() : value
  }

  protected async onActionClick(action: ModalAction<R, D>): Promise<void> {
    const ctx = (this.config().data ?? {}) as D
    const payload = (await action.onClick?.(ctx)) as R | undefined

    if (action.closeOnClick) {
      const result: ModalResult<R> = {
        action: 'action',
        text: action.text,
        payload
      }
      this._dialogRef.close(result)
      this.closed.emit(result)
    }
  }
}
