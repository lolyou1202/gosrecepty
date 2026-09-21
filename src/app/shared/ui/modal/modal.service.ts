import { Injectable, TemplateRef, Type, inject } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from './modal.component'
import {
  ModalComponentConfig,
  ModalConfig,
  ModalResult,
  ModalTemplateConfig
} from './modal.model'

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly matDialog = inject(MatDialog)

  /** Открыть модалку с компонентом */
  public open<C = unknown, D = unknown, R = unknown>(
    component: Type<C>,
    config?: ModalComponentConfig<D, R>
  ): MatDialogRef<ModalComponent<D, R>, ModalResult<R>>

  /** Открыть модалку с шаблоном */
  public open<C = unknown, D = unknown, R = unknown>(
    template: TemplateRef<C>,
    config?: ModalTemplateConfig<C, D, R>
  ): MatDialogRef<ModalComponent<D, R>, ModalResult<R>>

  /** Реализация — обе ветки собираются в один discriminated union */
  public open<C = unknown, D = unknown, R = unknown>(
    componentOrTemplate: Type<C> | TemplateRef<C>,
    config: ModalComponentConfig<D, R> & ModalTemplateConfig<C, D, R>
  ): MatDialogRef<ModalComponent<D, R>, ModalResult<R>> {
    const options: ModalConfig<C, D, R> =
      componentOrTemplate instanceof TemplateRef
        ? { ...config, template: componentOrTemplate }
        : { ...config, component: componentOrTemplate }

    const dialogRef = this.matDialog.open<
      ModalComponent<D, R>,
      ModalConfig<C, D, R>,
      ModalResult<R>
    >(ModalComponent, {
      data: options,
      maxWidth: 'none',
      maxHeight: 'none',
      autoFocus: 'dialog',
      panelClass: ['overlay-panel-reset', 'modal-panel'],
      backdropClass: 'overlay-backdrop-dark'
    })

    return dialogRef
  }
}
