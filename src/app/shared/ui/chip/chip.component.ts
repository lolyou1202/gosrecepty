import {
  ChangeDetectionStrategy,
  Component,
  input,
  model
} from '@angular/core'
import { IconComponent } from '../icon/icon.component'
import { FormCheckboxControl } from '@angular/forms/signals'

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipComponent implements FormCheckboxControl {
  public variant = input<'inside' | 'outside'>('inside')
  public label = input<string>()
  public icon = input<string>()
  public disabled = input<boolean>(false)
  public checked = model<boolean>(false)

  protected toggle(): void {
    if (this.disabled()) return

    this.checked.update(value => !value)
  }
}
