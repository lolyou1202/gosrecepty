import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  model
} from '@angular/core'
import { IconComponent } from '../icon/icon.component'
import { IconNames } from '../icon/icon-names.type'

@Component({
  selector: 'app-button-circle',
  templateUrl: 'button-circle.component.html',
  styleUrl: 'button-circle.component.scss',
  imports: [IconComponent],
  host: {
    '[style.--button-circle-size]': 'size()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonCircleComponent {
  public readonly label = input<string>()
  public readonly iconName = input<IconNames>()
  public readonly disabled = input<boolean>(false)
  public readonly size = input<string>('32px')

  public readonly hovered = model<boolean>(false)

  public readonly clicked = output<void>()

  protected onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit()
    }
  }
}
