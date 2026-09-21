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
  InjectionToken
} from '@angular/core'
import { ButtonDefaultComponent } from '../button-default/button-default.component'
import { DividerComponent } from '../../components/divider/divider.component'
import { IconComponent } from '../icon/icon.component'
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ModalAction, ModalConfig, ModalResult } from './modal.model'

export const MODAL_CONFIG = new InjectionToken<ModalConfig>('MODAL_CONFIG')

export const MODAL_REF = new InjectionToken<
  MatDialogRef<ModalComponent, ModalResult>
>('MODAL_REF')

@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  styleUrl: 'modal.component.scss',
  imports: [
    ButtonDefaultComponent,
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

  protected async onActionClick(action: ModalAction<R, D>): Promise<void> {
    const ctx = (this.config().data ?? {}) as D
    const payload = (await action.onClick?.(ctx)) as R | undefined

    if (action.closeOnClick !== false) {
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
