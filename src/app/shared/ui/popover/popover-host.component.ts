import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  TemplateRef,
  Type,
  computed,
  inject,
  input
} from '@angular/core'
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common'
import { PopoverConfig } from './popover.model'
import { PopoverRef } from './popover.ref'
import { POPOVER_DATA, POPOVER_REF } from './popover.tokens'

@Component({
  selector: 'app-popover-host',
  standalone: true,
  imports: [NgComponentOutlet, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (contentComponent(); as component) {
      <ng-container
        [ngComponentOutlet]="component"
        [ngComponentOutletInputs]="inputs()"
        [ngComponentOutletInjector]="injector()"
      />
    } @else if (contentTemplate(); as template) {
      <ng-container
        [ngTemplateOutlet]="template"
        [ngTemplateOutletContext]="context()"
        [ngTemplateOutletInjector]="injector()"
      />
    }
  `,
  host: { class: 'popover-host' }
})
export class PopoverHostComponent<C = unknown, D = unknown, R = unknown> {
  private readonly _parentInjector = inject(Injector)
  private readonly _config = inject<PopoverConfig<C, D>>(POPOVER_DATA)
  private readonly _ref = inject<PopoverRef<R>>(POPOVER_REF)

  public config = input<PopoverConfig<C, D>>(this._config)

  protected readonly contentComponent = computed<Type<unknown> | null>(() => {
    const c = this.config()
    return 'component' in c ? c.component : null
  })

  protected readonly contentTemplate = computed<TemplateRef<C> | null>(() => {
    const c = this.config()
    return 'template' in c ? c.template : null
  })

  protected readonly inputs = computed<Record<string, unknown>>(() => {
    const c = this.config()
    return 'component' in c ? (c.componentInputs ?? {}) : {}
  })

  protected readonly context = computed<unknown>(() => {
    const c = this.config()
    if (!('template' in c)) return {}
    return {
      close: (payload?: R): void => this._ref.close(payload),
      ...(c.templateContext ?? {})
    }
  })

  protected readonly injector = computed(() =>
    Injector.create({
      parent: this._parentInjector,
      providers: [{ provide: POPOVER_REF, useValue: this._ref }]
    })
  )
}
