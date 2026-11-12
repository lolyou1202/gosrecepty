import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { IconComponent } from '@shared/ui/icon/icon.component'
import { ProgressCircleComponent } from '@shared/ui/progress-circle/progress-circle.component'
import {
  DefaultButtonStyleVariant,
  DefaultButtonType
} from './default-button.model'

@Component({
  selector: 'app-default-button',
  templateUrl: './default-button.component.html',
  styleUrl: './default-button.component.scss',
  imports: [IconComponent, ProgressCircleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultButtonComponent {
  public readonly styleVariant = input<DefaultButtonStyleVariant>('primary')
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
