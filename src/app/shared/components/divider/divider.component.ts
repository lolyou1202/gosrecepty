import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  input
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { DividerOrientation, DividerVariant } from './divider.model'
import { clsx } from 'clsx'

@Component({
  selector: 'app-divider',
  template: '',
  styleUrl: './divider.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerComponent {
  public orientation = input<DividerOrientation>('horizontal')
  public variant = input<DividerVariant>('primary')
  public margin = input<string>('0px')
  public thickness = input<string>('1px')

  @HostBinding('class')
  public get hostClasses(): string {
    return clsx(
      'divider',
      `divider--${this.orientation()}`,
      `divider--${this.variant()}`
    )
  }

  @HostBinding('style.--divider-margin')
  public get dividerMargin(): string {
    return this.orientation() === 'horizontal'
      ? `${this.margin()} 0`
      : `0 ${this.margin()}`
  }

  @HostBinding('style.--divider-thickness')
  public get dividerThickness(): string {
    return this.thickness()
  }
}
