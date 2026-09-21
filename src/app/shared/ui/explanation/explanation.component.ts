import { Component, ChangeDetectionStrategy, input } from '@angular/core'
import { ExplanationState, ExplanationVariant } from './explanation.model'

@Component({
  selector: 'app-explanation',
  templateUrl: 'explanation.component.html',
  styleUrl: 'explanation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplanationComponent {
  public readonly type = input<ExplanationState>('info')
  public readonly variant = input<ExplanationVariant>('outside')
  public readonly title = input<string>()
  public readonly text = input<string>()
}
