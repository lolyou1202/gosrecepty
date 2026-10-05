import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
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
import { IconComponent } from '../icon/icon.component'
import { DropdownPanelComponent } from '../dropdown-panel/dropdown-panel.component'
import { FocusMonitor } from '@angular/cdk/a11y'

@Component({
  selector: 'app-base-input',
  templateUrl: './base-input.component.html',
  styleUrl: './base-input.component.scss',
  imports: [CommonModule, IconComponent, DropdownPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseInputComponent
  implements FormValueControl<string>, AfterViewInit, OnDestroy
{
  private readonly _focusMonitor = inject(FocusMonitor)
  private readonly _hostRef = inject<ElementRef<HTMLElement>>(ElementRef)

  public readonly mode = input<'input' | 'display'>('input')
  public readonly type = input<string>()
  public readonly placeholder = input<string>()
  public readonly hint = input<string>()
  public readonly label = input<string>()
  public readonly iconName = input<string>()
  public readonly clearable = input<boolean>(false)
  public readonly invalid = input<boolean>(false)
  public readonly dirty = input<boolean>(false)
  public readonly disabled = input<boolean>(false)
  public readonly errors = input<
    readonly WithOptionalFieldTree<ValidationError>[]
  >([])
  public readonly dropdownMaxHeight = input<number>()

  public readonly value = model<string>('')
  public readonly expanded = model<boolean>(false)
  public readonly touched = model<boolean>(false)

  public readonly blurred = output<void>()
  public readonly clicked = output<void>()

  public readonly focused = signal<boolean>(false)

  private readonly _fieldRef = viewChild<ElementRef<HTMLInputElement>>('field')
  private readonly _fieldDisplayRef =
    viewChild<ElementRef<HTMLDivElement>>('fieldDisplay')

  public ngAfterViewInit(): void {
    this._focusMonitor.monitor(this._hostRef, true).subscribe(origin => {
      if (origin === null) {
        this.focused.set(false)
        this.rollup()
      }
    })
  }

  public ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._hostRef)
  }

  protected readonly showClearButton = computed(
    () => this.clearable() && this.focused() && !this.disabled() && this.value()
  )

  protected readonly errorMessages = computed(() =>
    this.errors()
      .map(error => error.message)
      .filter((msg): msg is string => !!msg)
  )

  public focus(): void {
    if (this.disabled()) return

    if (this.mode() === 'input') {
      this._fieldRef()?.nativeElement.focus()
    } else {
      this._fieldDisplayRef()?.nativeElement.focus()
    }
  }

  public clear(): void {
    if (this.disabled()) return

    this.value.set('')
  }

  public expand(): void {
    this.focused.set(true)
    this.expanded.set(true)
  }

  public rollup(resetFocus?: boolean): void {
    this.expanded.set(false)
    this.touched.set(true)

    if (resetFocus) {
      this.focused.set(false)
    }
  }

  protected onFocus(): void {
    if (this.disabled()) return

    this.focused.set(true)
  }

  protected onInput(event: Event): void {
    if (this.disabled()) return

    const target = event.target as HTMLInputElement
    this.value.set(target.value)
    this.touched.set(true)
  }

  protected onFieldClick(): void {
    if (this.mode() === 'input' || this.disabled()) return

    if (this.expanded()) {
      this.rollup(true)
    } else {
      this.expand()
    }
  }

  protected onFieldKeydown(event: KeyboardEvent): void {
    if (this.mode() === 'input' || this.disabled()) return

    if (event.key === 'Enter' || event.key === ' ') {
      if (this.expanded()) {
        this.rollup()
      } else {
        this.expand()
      }
    } else if (event.key === 'Escape' && this.expanded()) {
      this.rollup()
    }
  }
}
