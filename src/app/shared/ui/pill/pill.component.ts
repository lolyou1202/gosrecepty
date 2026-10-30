import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { IconComponent } from '../icon/icon.component'
import { PillSide, PillStyleVariant } from './pill.model'

@Component({
  selector: 'app-pill',
  templateUrl: './pill.component.html',
  styleUrl: './pill.component.scss',
  imports: [IconComponent],
  host: {
    '[class.--side-inside]': "side() === 'inside'",
    '[class.--side-outside]': "side() === 'outside'",
    '[class.--style-outlined]': "styleVariant() === 'outlined'",
    '[class.--style-solid]': "styleVariant() === 'solid'",
    '[class.--style-soft]': "styleVariant() === 'soft'"
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PillComponent {
  public readonly side = input<PillSide>('inside')
  public readonly styleVariant = input<PillStyleVariant>('outlined')
  public readonly label = input.required<string>()

  public readonly removed = output()

  protected remove(): void {
    this.removed.emit()
  }
}
