import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { ChipSide, ChipStyleVariant } from './chip.model'
import { IconComponent } from '../icon/icon.component'

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  imports: [IconComponent],
  host: {
    '[class.--side-inside]': "side() === 'inside'",
    '[class.--side-outside]': "side() === 'outside'",
    '[class.--style-outlined]': "styleVariant() === 'outlined'",
    '[class.--style-solid]': "styleVariant() === 'solid'",
    '[class.--active]': 'checked()',
    '[class.--only-icon]': 'icon() && !label()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipComponent {
  public readonly checked = input<boolean>(false)
  public readonly disabled = input<boolean>(false)

  public readonly side = input<ChipSide>('inside')
  public readonly styleVariant = input<ChipStyleVariant>('outlined')
  public readonly label = input<string>()
  public readonly icon = input<string>()

  public readonly toggled = output<void>()

  protected toggle(): void {
    if (this.disabled()) return
    this.toggled.emit()
  }
}
