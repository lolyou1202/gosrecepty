import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
  output,
  runInInjectionContext,
  signal
} from '@angular/core'
import { FilterConfig } from './filter.model'
import { FilterService } from './services/filter.service'
import { FilterConfigService } from './services/filter-config.service'
import { ModalService } from '../../services/modal.service'
import { ChipComponent } from '../../ui/pill/pill.component'
import { InputComponent } from '../../ui/default-input/default-input.component'
import { IconComponent } from '../../ui/icon/icon.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { filter, map } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { FILTER_PROVIDERS } from './filter.providers'
import { DropdownInputComponent } from '../dropdown-input/dropdown-input.component'
import {
  FilterFormModel,
  FilterFormService,
  FilterFormWidgetsModel
} from './services/filter-form.service'
import { FieldState, FieldTree, FormField } from '@angular/forms/signals'

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  imports: [
    ChipComponent,
    InputComponent,
    IconComponent,
    DropdownInputComponent,
    FormField
  ],
  providers: [ModalService, FILTER_PROVIDERS, FilterFormService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit, OnDestroy {
  private readonly _injector = inject(Injector)
  private readonly _destroyRef = inject(DestroyRef)
  private readonly _router = inject(Router)
  private readonly _route = inject(ActivatedRoute)
  private readonly _modalService = inject(ModalService)
  private readonly _filterService = inject(FilterService)
  protected readonly _filterFormService = inject(FilterFormService)

  public readonly configs = input.required<FilterConfig[]>()
  public readonly filterModalTitle = input<string>('Фильтры')
  public readonly showChips = input<boolean>(false)
  public readonly showOpenModalBtn = input<boolean>(true)

  //protected readonly showedFieldsForm = computed(
  //  () => this._filterFormService.showedFieldsForm
  //)
  //protected readonly hiddenFieldsForm = computed(
  //  () => this._filterFormService.hiddenFieldsForm
  //)

  protected readonly hasActiveFilters = computed(
    () => this._filterService.activeFiltersCount() > 0
  )
  //protected readonly chips = computed(() => this._filterService.chips())

  //protected readonly getField = computed(() => {
  //  const f = this.form()

  //  return (name: string) => f?.[name as keyof FilterFormModel] || null
  //})

  public chipRemoved = output<string>()
  public filterModalOpened = output<void>()
  public filtersCleared = output<void>()
  public filtersApplied = output<void>()

  public openFilterModal(): void {
    //this._modalService.open(FilterModalComponent, {
    //  title: this.filterModalTitle(),
    //  actions: [
    //    {
    //      variant: 'secondary',
    //      text: 'Сбросить',
    //      onClick: (): void => this.clearModalFilters()
    //    },
    //    {
    //      variant: 'primary',
    //      text: 'Применить',
    //      onClick: (): void => this.applyModalFilters()
    //    }
    //  ]
    //})
    //this.filterModalOpened.emit()
  }

  //protected getField(
  //  name: keyof FilterFormModel
  //): FieldState<FilterFormWidgetsModel> | undefined {
  //  const form = this.form()
  //  //const fieldName = name as keyof FilterFormModel
  //  //const formState = form?.[fieldName]
  //  //return formState || undefined
  //  if (!form) return undefined

  //  return this._filterFormService.getField(form, name)
  //}

  //protected getInputField(name: string): FieldTree<string> | undefined {
  //  const f = this.form()
  //  if (!f) return undefined
  //  return f[name] as FieldTree<string> | undefined
  //}

  public clearModalFilters(): void {
    this._filterService.clearModalFilters()
  }

  public applyModalFilters(): void {
    this._filterService.applyModalFilters()
    //this._modalService.close()
  }

  public removeChip(name: string): void {
    this._filterService.clearFilter(name)
    this.chipRemoved.emit(name)
  }

  public clearAllFilters(): void {
    this._filterService.clearAllFilters()
    //this._filterService.resetModalFilters()
    this.filtersCleared.emit()
  }

  public closeModal(): void {
    //this._modalService.close()
  }

  public ngOnInit(): void {
    runInInjectionContext(this._injector, () => {
      this._filterFormService.createForm(this.configs())
      this._filterFormService.getInputField('search_1')?.().value.set('asdddd')
    })
    //const hiddenFieldsForm = this._filterFormService.createForm(hiddenConfigs)
    //this.showedFieldsForm.set(showedFieldsForm)
    //this.hiddenFieldsForm.set(hiddenFieldsForm)
    //this._filterService.resetModalFilters()
    //this._route.queryParams
    //  .pipe(
    //    takeUntilDestroyed(this._destroyRef),
    //    filter(params => Object.keys(params).length > 0),
    //    map(params => {
    //      const filterNames = this.configs().map(c => c.name)
    //      return Object.entries(params)
    //        .filter(([key]) => filterNames.includes(key))
    //        .reduce(
    //          (acc, [key, value]) => ({ ...acc, [key]: value }),
    //          {} as Record<string, string>
    //        )
    //    })
    //  )
    //  .subscribe(params => {
    //    Object.entries(params as Record<string, string>).forEach(
    //      ([key, value]) => {
    //        const config = this.configs()[key]
    //        if (!config) return
    //        switch (config.type) {
    //          case 'input':
    //            this._filterService.updateStringFilter(key, value)
    //            break
    //          case 'select':
    //            this._filterService.updateMultiselectFilter(
    //              key,
    //              value.split(',')
    //            )
    //            break
    //        }
    //      }
    //    )
    //  })
    //this._filterService.setConfigs(this.configs())
  }

  public ngDoCheck(): void {
    //console.log(this._filterFormService._showedFieldsForm?.().value())
  }

  public ngOnDestroy(): void {
    this.closeModal()
  }
}
