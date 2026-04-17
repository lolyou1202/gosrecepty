import { Component, inject } from '@angular/core'
import { BorderGroupComponent } from './shared/components/border-group/border-group.component'
import { BorderGroupChildComponent } from './shared/components/border-group/border-group-child/border-group-child.component'
import { ModalService } from './shared/services/modal.service'
import { ModalComponent } from './shared/components/modal/modal.component'
import { ModalFormComponent } from './shared/components/modal-forms/test-base-modal.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [BorderGroupComponent, BorderGroupChildComponent]
})
export class AppComponent {
  private _modalService = inject(ModalService)

  protected openModal(event: MouseEvent): void {
    const modalRef = this._modalService.open(
      ModalFormComponent,
      {
        title: 'Заголовок',
        //darkBackdrop: true,
        actionsJustify: 'center',
        actions: [
          {
            variant: 'secondary',
            text: 'Сбросить',
            onClick: (): void => {}
          },
          {
            variant: 'primary',
            text: 'Применить',
            onClick: (): void => {}
          }
        ]
      },
      { asd: 'asd' }
    )

    modalRef.closed.subscribe(() => console.log('Модальное окно закрыто'))
  }
}
