import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  input
} from '@angular/core'
import { DividerOrientation, DividerColor } from './divider.model'
import { clsx } from 'clsx'

@Component({
  selector: 'app-divider',
  template: '',
  styleUrl: './divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerComponent {
  public orientation = input<DividerOrientation>('horizontal')
  public variant = input<DividerColor>('solitario')
  public marginHorizontal = input<string>('0px')
  public marginVertical = input<string>('0px')
  public thickness = input<string>('1px')

  @HostBinding('class')
  public get hostClasses(): string {
    return clsx('divider', `--${this.orientation()}`, `--${this.variant()}`)
  }

  @HostBinding('style.--divider-margin')
  public get dividerMargin(): string {
    return `${this.marginVertical()} ${this.marginHorizontal()}`
  }

  @HostBinding('style.--divider-thickness')
  public get dividerThickness(): string {
    return this.thickness()
  }
}
