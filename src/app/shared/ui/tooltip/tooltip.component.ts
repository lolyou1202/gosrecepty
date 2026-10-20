import {
  Component,
  ChangeDetectionStrategy,
  input,
  HostBinding
} from '@angular/core'
import { TooltipPosition } from './tooltip.model'

@Component({
  selector: 'app-tooltip',
  templateUrl: 'tooltip.component.html',
  styleUrl: 'tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent {
  public readonly content = input.required<string | string[]>()
  public readonly position = input<TooltipPosition>('top')
  public readonly tooltipColor = input<string>()

  protected isArray(value: unknown): value is string[] {
    return Array.isArray(value)
  }

  @HostBinding('style.--tooltip-color')
  protected get getTooltipColor(): string | undefined {
    return this.tooltipColor()
  }
}
