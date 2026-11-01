import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core'
import { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals'

@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  styleUrl: './error-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorListComponent {
  public readonly errors = input<
    readonly WithOptionalFieldTree<ValidationError>[]
  >([])

  protected readonly messages = computed(() =>
    this.errors()
      .map(e => e.message)
      .filter((m): m is string => !!m)
  )

  protected readonly numbered = computed(() => this.messages().length > 1)
}
