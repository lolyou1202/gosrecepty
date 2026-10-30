import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { DefaultButtonVariant, DefaultButtonType } from './default-button.model'
import { IconComponent } from '../icon/icon.component'
import { ProgressCircleComponent } from '../progress-circle/progress-circle.component'

@Component({
  selector: 'app-default-button',
  templateUrl: './default-button.component.html',
  styleUrl: './default-button.component.scss',
  imports: [IconComponent, ProgressCircleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultButtonComponent {
  public readonly variant = input<DefaultButtonVariant>('primary')
  public readonly type = input<DefaultButtonType>('button')
  public readonly loading = input<boolean>(false)
  public readonly fullWidth = input<boolean>(false)
  public readonly height = input<string>()
  public readonly label = input<string>()
  public readonly iconName = input<string>()
  public readonly circleRadius = input<boolean>()
  public readonly smallPadding = input<boolean>()
  public readonly disabled = input<boolean>()

  public clicked = output<PointerEvent>()

  public onClick(event: PointerEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event)
    }
  }
}
