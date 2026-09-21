import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import {
  ButtonDefaultType,
  ButtonDefaultVariant,
  ButtonDefaultWidth
} from './button-default.model'
import { IconComponent } from '../icon/icon.component'
import { ProgressCircleComponent } from '../progress-circle/progress-circle.component'

@Component({
  selector: 'app-button-default',
  templateUrl: './button-default.component.html',
  styleUrl: './button-default.component.scss',
  imports: [IconComponent, ProgressCircleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonDefaultComponent {
  public readonly variant = input<ButtonDefaultVariant>('primary')
  public readonly type = input<ButtonDefaultType>('button')
  public readonly loading = input<boolean>(false)
  public readonly width = input<ButtonDefaultWidth>('default')
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
