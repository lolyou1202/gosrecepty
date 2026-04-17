import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  output
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonVariant, ButtonWidthVariant } from './button.model'

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  public readonly variant = input<ButtonVariant>('primary')
  public readonly width = input<ButtonWidthVariant>('default')
  public readonly text = input<string>()
  public readonly smallPadding = input<boolean>()
  public readonly disabled = input<boolean>()
  public readonly showLoader = input<boolean>()

  public clicked = output<void>()

  public onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit()
    }
  }

  @HostBinding('class.small-padding')
  public get isSmallPadding(): boolean {
    return !!this.smallPadding()
  }

  @HostBinding('class.wide-width')
  public get isWidthStyle(): boolean {
    return this.width() === 'wide'
  }
}
