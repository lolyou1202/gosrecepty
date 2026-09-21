import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { IconComponent } from '../icon/icon.component'

@Component({
  selector: 'app-link-button',
  templateUrl: './link-button.component.html',
  styleUrl: './link-button.component.scss',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkButtonComponent {
  public readonly label = input<string>()
  public readonly iconName = input<string>()
  public readonly disabled = input<boolean>()

  public clicked = output<void>()

  public onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit()
    }
  }
}
