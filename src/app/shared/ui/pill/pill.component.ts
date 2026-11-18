import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { Nullable } from '@shared/utils/types'
import { IconComponent } from '../icon/icon.component'
import { PillSide, PillStyleVariant } from './pill.model'

@Component({
  selector: 'app-pill',
  templateUrl: './pill.component.html',
  styleUrl: './pill.component.scss',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PillComponent {
  public readonly side = input<PillSide>('inside')
  public readonly styleVariant = input<PillStyleVariant>('outlined')
  public readonly label = input.required<string>()
  public readonly value = input<Nullable<string>>(null)

  public readonly removed = output()

  protected remove(): void {
    this.removed.emit()
  }
}
