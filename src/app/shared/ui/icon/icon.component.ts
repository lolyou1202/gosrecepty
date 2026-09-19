import { ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  host: {
    '[style.--icon-color]': 'color()',
    '[style.--icon-size]': 'size()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  public readonly name = input.required<string>()
  public readonly color = input<string>('inherit')
  public readonly size = input<string>()
}
