import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { IconComponent } from '../icon/icon.component'

@Component({
  selector: 'app-shadow-button',
  templateUrl: './shadow-button.component.html',
  styleUrl: './shadow-button.component.scss',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShadowButtonComponent {
  public readonly withHover = input<boolean>(false)
  public readonly disabled = input<boolean>(false)
  public readonly label = input<string>()
  public readonly icon = input<string>()

  public readonly clicked = output<PointerEvent>()

  public onClick(event: PointerEvent): void {
    if (!this.disabled()) {
      this.clicked.emit(event)
    }
  }
}
