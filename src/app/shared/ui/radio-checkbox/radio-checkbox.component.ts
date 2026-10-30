import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output
} from '@angular/core'
import { FormCheckboxControl } from '@angular/forms/signals'

@Component({
  selector: 'app-radio-checkbox',
  templateUrl: './radio-checkbox.component.html',
  styleUrl: './radio-checkbox.component.scss',
  host: {
    '[class.--checked]': "checked()",
    '[class.--disabled]': "disabled()",
    '[class.--invalid]': "invalid()",
    '[class.--readonly]': "readonly()"
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class RadioCheckboxComponent implements FormCheckboxControl {
  public readonly label = input<string>()
  public readonly disabled = input<boolean>(false)
  public readonly readonly = input<boolean>(false)
  public readonly invalid = input<boolean>(false)
  public readonly touched = input<boolean>(false)

  public readonly checked = model<boolean>(false)

  public readonly touch = output<void>()

  protected select(): void {
    if (this.disabled() || this.readonly()) return
    this.checked.set(true)
  }
}
