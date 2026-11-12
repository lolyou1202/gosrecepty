import {
  Component,
  inject,
  ChangeDetectionStrategy,
  TemplateRef,
  input,
  Type,
  Injector,
  computed
} from '@angular/core'
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common'
import { OVERLAY_REF } from '@shared/ui/overlay/tokens'
import { DividerComponent } from '@shared/ui/divider/divider.component'
import { IconComponent } from '@shared/ui/icon/icon.component'
import { LayoutService } from '@shared/utils/services/layout.service'
import type { Nullable } from '@shared/utils/types'
import type { PopupConfig } from './models'
import { POPUP_CONFIG, POPUP_REF } from './tokens'

let nextId = 0

@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html',
  styleUrl: 'popup.component.scss',
  imports: [
    DividerComponent,
    IconComponent,
    NgTemplateOutlet,
    NgComponentOutlet
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupComponent<C = unknown, D = unknown> {
  private readonly _parentInjector = inject(Injector)
  private readonly _overlayRef = inject(OVERLAY_REF)
  private readonly _layout = inject(LayoutService)

  public config = input<Nullable<PopupConfig<C, D>>>()

  protected readonly titleId = `modal-title-${nextId++}`

  protected readonly title = computed<Nullable<string>>(
    () => this.config()?.title
  )

  protected readonly contentComponent = computed<Nullable<Type<C>>>(() => {
    const c = this.config()
    return c && 'component' in c ? c.component : null
  })

  protected readonly contentComponentInputs = computed<Record<string, unknown>>(
    () => {
      const c = this.config()
      return c && 'component' in c ? (c.componentInputs ?? {}) : {}
    }
  )

  protected readonly contentTemplate = computed<Nullable<TemplateRef<C>>>(
    () => {
      const c = this.config()
      return c && 'template' in c ? c.template : null
    }
  )

  protected readonly contentTemplateContext = computed<Nullable<C>>(() => {
    const c = this.config()
    return c && 'template' in c ? (c.templateContext ?? null) : null
  })

  protected bodyInjector = computed(() =>
    Injector.create({
      parent: this._parentInjector,
      providers: [
        {
          provide: POPUP_CONFIG,
          useValue: this.config()
        },
        {
          provide: POPUP_REF,
          useValue: {
            close: (): void => this.close()
          }
        }
      ]
    })
  )

  protected readonly isMobile = computed<boolean>(() => this._layout.isMobile())

  public close(): void {
    this._overlayRef.close()
  }
}
