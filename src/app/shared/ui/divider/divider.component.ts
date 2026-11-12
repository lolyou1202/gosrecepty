import { Component, ChangeDetectionStrategy, input } from '@angular/core'
import { DividerOrientation, DividerColorName } from './divider.model'

@Component({
  selector: 'app-divider',
  template: '',
  styleUrl: './divider.component.scss',
  host: {
    '[class.--divider-orientation-horizontal]':
      'orientation() === "horizontal"',
    '[class.--divider-orientation-vertical]': 'orientation() === "vertical"',
    '[style.--divider-margin]':
      '`${this.marginVertical()}px ${this.marginHorizontal()}px`',
    '[style.--divider-thickness]': '`${thickness()}px`',
    '[class.--divider-color-solitario]': 'colorName() === "solitario"',
    '[class.--divider-color-divisore]': 'colorName() === "divisore"',
    '[class.--divider-color-ciottoli]': 'colorName() === "ciottoli"'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerComponent {
  public readonly orientation = input<DividerOrientation>('horizontal')
  public readonly colorName = input<DividerColorName>('solitario')
  public readonly marginHorizontal = input<number>(0)
  public readonly marginVertical = input<number>(0)
  public readonly thickness = input<number>(1)
}
