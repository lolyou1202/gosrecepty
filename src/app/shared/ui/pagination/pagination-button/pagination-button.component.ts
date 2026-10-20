import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { IconComponent } from '@shared/ui/icon/icon.component'

@Component({
  selector: 'app-pagination-button',
  templateUrl: './pagination-button.component.html',
  styleUrl: './pagination-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent]
})
export class PaginationButtonComponent {
  public readonly text = input<string | number>()
  public readonly icon = input<string>()
  public readonly active = input<boolean>()
  public readonly disabled = input<boolean>()

  public readonly clicked = output<void>()

  protected onClick(): void {
    if (this.disabled()) return
    this.clicked.emit()
  }
}
