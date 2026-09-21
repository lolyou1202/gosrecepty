import {
  Component,
  ChangeDetectionStrategy,
  input,
  output
} from '@angular/core'

@Component({
  selector: 'app-dotted-list-line',
  templateUrl: 'dotted-list-line.component.html',
  styleUrl: 'dotted-list-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DottedListLineComponent {
  public readonly name = input.required<string>()
  public readonly value = input.required<string>()
  public readonly clickableName = input<boolean>()

  public readonly nameClicked = output<void>()

  protected onClickName(): void {
    if (this.clickableName()) {
      this.nameClicked.emit()
    }
  }
}
