import { InjectionToken } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalConfig, ModalResult } from './modal.model'
import { ModalComponent } from './modal.component'

export const MODAL_CONFIG = new InjectionToken<ModalConfig>('MODAL_CONFIG')

export const MODAL_REF = new InjectionToken<
  MatDialogRef<ModalComponent, ModalResult>
>('MODAL_REF')
