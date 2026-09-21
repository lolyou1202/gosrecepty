import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  signal
} from '@angular/core'
import { ButtonCircleComponent } from '../../button-circle/button-circle.component'

@Component({
  selector: 'app-accordion',
  templateUrl: 'accordion.component.html',
  styleUrl: 'accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonCircleComponent]
})
export class AccordionComponent {
  public readonly title = input.required<string>()
  public readonly disabled = input<boolean>(false)

  public readonly expanded = model<boolean>(false)

  public readonly stackMode = signal<boolean>(false)

  protected toggle(): void {
    if (!this.disabled()) {
      this.expanded.update(value => !value)
    }
  }
}
