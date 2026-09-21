import { Component, ChangeDetectionStrategy, input } from '@angular/core'
import { IconComponent } from '../icon/icon.component'
import { Status, TagsListComponent } from '../tags-list/tags-list.component'

@Component({
  selector: 'app-catalog-card',
  templateUrl: 'catalog-card.component.html',
  styleUrl: 'catalog-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, TagsListComponent]
})
export class CatalogCardComponent {
  public readonly title = input.required<string>()
  public readonly helpInfo = input<string>()
  public readonly imgUrl = input<string>()
  public readonly isOnFavorite = input<boolean>(false)
  public readonly showFavorite = input<boolean>(false)
  public readonly statuses = input<Status[]>([])
  public readonly tags = input<string[]>([])

  protected toggleFavorite(): void {}
}
