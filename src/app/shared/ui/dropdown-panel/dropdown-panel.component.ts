import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgScrollbarModule } from 'ngx-scrollbar'

@Component({
  selector: 'app-dropdown-panel',
  templateUrl: './dropdown-panel.component.html',
  styleUrl: './dropdown-panel.component.scss',
  imports: [CommonModule, NgScrollbarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--dropdown-panel--maxheight]':
      'maxHeight() ? maxHeight() + "px" : null'
  }
})
export class DropdownPanelComponent {
  public readonly maxHeight = input<number>()
}
