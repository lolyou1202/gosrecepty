import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output
} from '@angular/core'
import { FormValueControl } from '@angular/forms/signals'
import { CommonModule } from '@angular/common'
import { InputWidthVariant } from './input.model'
import { IconComponent } from '../icon/icon.component'

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements FormValueControl<string> {
  public readonly width = input<InputWidthVariant>('default')
  public readonly placeholder = input<string>()
  public readonly label = input<string>()
  public readonly readOnly = input<boolean>()
  public readonly clearable = input<boolean>()
  public readonly invalid = input<boolean>()
  public readonly disabled = input<boolean>()
  //public readonly showLoader = input<boolean>()

  public readonly value = model<string>('')

  public readonly changed = output<string>()
  public readonly cleared = output<void>()
  public readonly blurred = output<void>()

  protected isFocused = false

  protected readonly showClearButton = computed(() => {
    return (
      this.clearable() && !this.disabled() && !this.readOnly() && !!this.value()
    )
  })

  private onChange: (value: any) => void = () => {}
  private onTouched: () => void = () => {}

  public writeValue(value: any): void {
    this.value.set(value ?? '')
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement
    const newValue = input.value
    this.value.set(newValue)
    this.onChange(newValue)
    this.changed.emit(newValue)
  }

  protected onBlur(): void {
    this.isFocused = false
    this.onTouched()
    this.blurred.emit()
  }

  protected onFocus(): void {
    this.isFocused = true
  }

  protected clear(): void {
    if (this.disabled() || this.readOnly()) return
    this.value.set('')
    this.onChange('')
    this.changed.emit('')
    this.cleared.emit()
  }
}
