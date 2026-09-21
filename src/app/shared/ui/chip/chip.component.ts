import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output
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
  public readonly = input<boolean>(false)
  public disabled = input<boolean>(false)
  public checked = model<boolean>(false)
  public clicked = output<void>()

  protected toggle(): void {
    if (this.disabled() || this.readonly()) return

    this.clicked.emit()
    this.checked.update(value => !value)
  }
}
