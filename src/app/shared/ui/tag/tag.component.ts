import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { IconComponent } from '../icon/icon.component'

export type TagVariant = 'default' | 'info'

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent]
})
export class TagComponent {
  public label = input.required<string>()
  public variant = input<TagVariant>('default')
  public icon = input<string>()
  public clickable = input<boolean>()

  public clicked = output<boolean>()

  public onClick(): void {
    if (this.clickable()) {
      this.clicked.emit(true)
    }
  }
}
