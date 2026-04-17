import { Component, inject, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { OVERLAY_CONFIG, OVERLAY_REF } from '../../models/overlay.tokens'
import { OverlayRef } from '../../models/overlay.types'
import { ModalConfig } from '../../models/modal.types'
import { ButtonComponent } from '../button/button.component'
import { DividerComponent } from '../divider/divider.component'
import { IconComponent } from '../icon/icon.component'

@Component({
  selector: 'app-modal',
  imports: [CommonModule, ButtonComponent, DividerComponent, IconComponent],
  templateUrl: 'modal.component.html',
  styleUrl: 'modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  protected readonly config = inject<ModalConfig>(OVERLAY_CONFIG)
  protected readonly ref = inject<OverlayRef>(OVERLAY_REF)

  public onClickCross(): void {
    this.ref.close()
  }
}
