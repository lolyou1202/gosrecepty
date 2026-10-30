import { ChangeDetectionStrategy, Component, input, model } from '@angular/core'
import { FormCheckboxControl } from '@angular/forms/signals'
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
export class ChipComponent implements FormCheckboxControl {
  public readonly side = input<ChipSide>('inside')
  public readonly styleVariant = input<ChipStyleVariant>('outlined')
  public readonly label = input<string>()
  public readonly icon = input<string>()
  public readonly disabled = input<boolean>(false)

  public readonly checked = model<boolean>(false)

  protected toggle(): void {
    if (this.disabled()) return

    this.checked.update(value => !value)
  }
}
