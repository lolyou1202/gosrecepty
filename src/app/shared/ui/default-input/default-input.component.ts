import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild
} from '@angular/core'
import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree
} from '@angular/forms/signals'
import { CommonModule } from '@angular/common'
import { InputVariant } from './default-input.model'
import { IconComponent } from '../icon/icon.component'

@Component({
  selector: 'app-default-input',
  templateUrl: './default-input.component.html',
  styleUrl: './default-input.component.scss',
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultInputComponent implements FormValueControl<string> {
  private readonly inputElement =
    viewChild.required<ElementRef<HTMLInputElement>>('inputElement')

  public readonly type = input<string>('text')
  public readonly variant = input.required<InputVariant>()
  //public readonly dropdownItems = input<InputDropdownItem[]>([])
  public readonly fullWidth = input<boolean>(true)
  public readonly clearable = input<boolean>(false)
  public readonly placeholder = input<string>()
  public readonly hint = input<string>()
  public readonly label = input<string>()
  public readonly invalid = input<boolean>(false)
  public readonly dirty = input<boolean>(false)
  public readonly disabled = input<boolean>(false)
  public readonly errors = input<
    readonly WithOptionalFieldTree<ValidationError>[]
  >([])

  public readonly value = model<string>('')
  public readonly touched = model<boolean>(false)

  public readonly blurred = output<void>()

  protected readonly isFocused = signal<boolean>(false)

  protected readonly showClearButton = computed(
    () =>
      this.clearable() && this.isFocused() && !this.disabled() && !!this.value()
  )

  protected readonly errorMessages = computed(() =>
    this.errors()
      .map(error => error.message)
      .filter((msg): msg is string => !!msg)
  )

  public focus(): void {
    if (this.disabled()) return
    this.isFocused.set(true)
    this.inputElement().nativeElement.focus()
  }

  protected onInput(value: string): void {
    if (this.disabled()) {
      this.value.set(this.value())
    }
    this.value.set(value)
    this.touched.set(true)
  }

  protected onBlur(): void {
    if (this.disabled()) return
    this.isFocused.set(false)
    this.blurred.emit()
  }

  public clear(): void {
    if (this.disabled()) return
    this.value.set('')
  }

  public onClickLoupe(): void {
    if (this.disabled()) return
  }
}
