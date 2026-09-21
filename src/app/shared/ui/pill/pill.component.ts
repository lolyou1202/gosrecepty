import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core'
import { IconComponent } from '../icon/icon.component'

@Component({
  selector: 'app-pill',
  imports: [IconComponent],
  templateUrl: './pill.component.html',
  styleUrl: './pill.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PillComponent {
	public variant = input<'inside' | 'outside'>('inside')
  public label = input.required<string>()

  public removed = output()

  protected remove(): void {
    this.removed.emit()
  }
}
