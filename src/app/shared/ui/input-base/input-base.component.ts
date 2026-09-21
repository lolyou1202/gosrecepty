import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild
} from '@angular/core'
import { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals'
import { CommonModule } from '@angular/common'
import { IconComponent } from '../icon/icon.component'
import { DropdownItem } from '../dropdown/dropdown.model'

@Component({
  selector: 'app-input-base',
  templateUrl: './input-base.component.html',
  styleUrl: './input-base.component.scss',
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputBaseComponent {
  private readonly fieldElement =
    viewChild<ElementRef<HTMLInputElement>>('field')

  public readonly dropdownItems = input<Pick<DropdownItem, 'id' | 'text'>[]>([])
  public readonly type = input<string>('text')
  public readonly placeholder = input<string>()
  public readonly hint = input<string>()
  public readonly label = input<string>()
  public readonly invalid = input<boolean>(false)
  public readonly focused = input<boolean>(false)
  public readonly disabled = input<boolean>(false)
  public readonly errors = input<
    readonly WithOptionalFieldTree<ValidationError>[]
  >([])

  protected readonly isFocused = signal<boolean>(false)

  protected readonly errorMessages = computed(() =>
    this.errors()
      .map(error => error.message)
      .filter((msg): msg is string => !!msg)
  )
}
