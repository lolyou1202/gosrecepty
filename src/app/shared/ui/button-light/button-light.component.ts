import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { ButtonLightShape } from './button-light.model'
import { IconComponent } from '../icon/icon.component'

@Component({
  selector: 'app-button-light',
  templateUrl: './button-light.component.html',
  styleUrl: './button-light.component.scss',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonLightComponent {
  public readonly size = input<string>('lg')
  public readonly circleSize = input<string>()
  public readonly shape = input<ButtonLightShape>('rounded')
  public readonly disabled = input<boolean>(false)
  public readonly label = input<string>()
  public readonly iconName = input<string>()

  public clicked = output<PointerEvent>()

  public onClick(event: PointerEvent): void {
    if (!this.disabled()) {
      this.clicked.emit(event)
    }
  }
}
