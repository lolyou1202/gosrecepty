import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'

let nextId = 0

@Component({
  selector: 'app-radio-checkbox',
  templateUrl: './radio-checkbox.component.html',
  styleUrl: './radio-checkbox.component.scss',
  host: {
    '[class.--checked]': 'checked()',
    '[class.--disabled]': 'disabled()',
    '[class.--invalid]': 'invalid()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioCheckboxComponent {
  public readonly id = input<string>(`radio-checkbox-group-${nextId++}`)
  public readonly name = input.required<string>()
  public readonly value = input.required<string | number>()
  public readonly label = input.required<string>()

  public readonly disabled = input<boolean>(false)
  public readonly readonly = input<boolean>(false)
  public readonly invalid = input<boolean>(false)

  public readonly checked = input<boolean>(false)

  public readonly checkedChange = output<void>()

  protected onChange(event: Event): void {
    if (this.disabled() || this.readonly()) {
      event.preventDefault()
      return
    }
    this.checkedChange.emit()
  }
}
