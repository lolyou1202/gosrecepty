import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'

@Component({
  selector: 'app-radio-checkbox',
  templateUrl: './radio-checkbox.component.html',
  styleUrl: './radio-checkbox.component.scss',
  host: {
    role: 'radio',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.tabindex]': 'disabled() ? null : tabindex()',
    '[class.--checked]': 'checked()',
    '[class.--disabled]': 'disabled()',
    '[class.--invalid]': 'invalid()',
    '(click)': 'onClick($event)'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioCheckboxComponent {
  public readonly label = input.required<string>()

  public readonly disabled = input<boolean>(false)
  public readonly readonly = input<boolean>(false)
  public readonly invalid = input<boolean>(false)
  public readonly touched = input<boolean>(false)
  public readonly tabindex = input<number>(-1)

  public readonly checked = input<boolean>(false)

  public readonly selected = output<void>()

  protected onClick(event: MouseEvent): void {
    if (this.disabled() || this.readonly()) {
      event.preventDefault()
      return
    }
    this.selected.emit()
  }
}
