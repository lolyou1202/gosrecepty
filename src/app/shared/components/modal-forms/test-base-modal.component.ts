import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { ModalComponent } from '../modal/modal.component'
import { OVERLAY_DATA, OVERLAY_REF } from '../../models/overlay.tokens'
import { OverlayRef } from '../../models/overlay.types'

@Component({
  selector: 'app-modal-form',
  imports: [CommonModule, ModalComponent],
  template: `<app-modal>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div>Test Component - Data</div>
    <div (click)="onClose()">Close</div>
  </app-modal>`,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalFormComponent implements OnInit {
  private readonly _data = inject(OVERLAY_DATA, {
    optional: true
  })
  private readonly _ref = inject<OverlayRef>(OVERLAY_REF)

  public ngOnInit(): void {
    console.log(this._data)
  }

  public onClose(): void {
    this._ref.close()
  }
}
