import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  TemplateRef,
  viewChild
} from '@angular/core'
import { IconNames } from '../icon/icon-names.type'
import { TagComponent, TagVariant } from '../tag/tag.component'
import { ModalService } from '../../services/modal.service'

export type Status = {
  variant: TagVariant
  label: string
  icon?: IconNames
}

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.scss',
  imports: [TagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsListComponent {
  private readonly _modalService = inject(ModalService)
  private readonly _modalTemplate =
    viewChild.required<TemplateRef<unknown>>('modalTemplate')

  public readonly limit = input<number>()
  public readonly statuses = input<Status[]>([])
  public readonly tags = input<string[]>([])

  public tagsList = computed<Status[]>(() => {
    const statuses = this.statuses()
    const tags = this.tags().map(tag => ({
      label: tag,
      variant: 'default' as const
    }))

    return [...statuses, ...tags]
  })

  public displayedTags = computed(() => {
    const limit = this.limit()
    const tagsList = this.tagsList()
    return limit ? tagsList.slice(0, limit) : tagsList
  })

  protected detailsLabel = computed(() => {
    return `Ещё ${this.tagsList().length - this.displayedTags().length}`
  })

  protected showDetailsButton = computed(() => {
    const limit = this.limit()
    return limit && this.tagsList().length > limit
  })

  public openModal(): void {
    const template = this._modalTemplate()
    this._modalService.open({
      template: template,
      config: {
        title: 'Полный список тэгов'
      }
    })
  }
}
