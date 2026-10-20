import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { IconComponent } from '../icon/icon.component'

export interface BreadcrumbItem {
  label: string
  link?: string
  disabled?: boolean
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent {
  public readonly items = input.required<BreadcrumbItem[]>()
}
