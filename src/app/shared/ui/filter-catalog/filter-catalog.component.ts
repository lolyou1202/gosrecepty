import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked
} from '@angular/core'
import { debounce, form, FormField, minLength } from '@angular/forms/signals'
import { ActivatedRoute, Router } from '@angular/router'
import { toSignal } from '@angular/core/rxjs-interop'
import { DefaultInputComponent } from '../default-input/default-input.component'
import { DividerComponent } from '../../components/divider/divider.component'
import { ChipComponent } from '../chip/chip.component'
import { ScrollableComponent } from '../scrollable/scrollable.component'
import { readStringParam } from '../../../utils/functions/read-string-param'

@Component({
  selector: 'app-filter-catalog',
  templateUrl: './filter-catalog.component.html',
  styleUrl: './filter-catalog.component.scss',
  imports: [
    FormField,
    DefaultInputComponent,
    DividerComponent,
    ChipComponent,
    ScrollableComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterCatalogComponent {
  private readonly _route = inject(ActivatedRoute)
  private readonly _router = inject(Router)

  //public readonly chips = input<FilterChip[]>([])
  public readonly pathPrefix = input<string>('filter')
  public readonly pathChipsSeparator = input<string>(',')
  public readonly showOpenModalBtn = input<boolean>(true)

  private readonly _queryParamsSignal = toSignal(this._route.queryParams)

  protected readonly quickForm = form(
    signal<{ search: string }>({ search: '' }),
    schemaPath => {
      debounce(schemaPath.search, 500)
      minLength(schemaPath.search, 3)
    }
  )

  protected readonly modalForm = form(
    signal<{ search: string }>({ search: '' }),
    schemaPath => {
      debounce(schemaPath.search, 500)
      minLength(schemaPath.search, 3)
    }
  )

  //protected readonly activeChips = computed<string[]>(() => {
  //  const params = this._queryParamsSignal()
  //  const chips = this.chips()
  //  const separator = this.pathChipsSeparator()
  //  const chipsKey = this._chipsParamKey

  //  if (!params) return []

  //  const activeChips: string[] = []
  //  const paramChips = readStringParam(chipsKey, params)

  //  parseArrayFromString(paramChips, separator).forEach(chip => {
  //    const chipExists = chips.some(c => c.name === chip)
  //    if (chipExists) {
  //      activeChips.push(chip)
  //    }
  //  })

  //  return activeChips
  //})

  //protected readonly displayedChips = computed<FilterChipDisplayed[]>(() =>
  //  this.chips().map(chip => {
  //    const activeChips = this.activeChips()
  //    return {
  //      ...chip,
  //      active: activeChips.includes(chip.name)
  //    }
  //  })
  //)

  constructor() {
    // Синхронизация search: URL → форма
    effect(() => {
      const params = this._queryParamsSignal()
      const searchKey = this._searchParamKey
      const paramSearch = readStringParam(searchKey, params) || ''

      untracked(() => {
        const current = this.quickForm.search().value()
        if (current !== paramSearch) {
          this.quickForm.search().value.set(paramSearch)
        }
      })
    })

    // Синхронизация search: форма → URL
    effect(() => {
      const searchControll = this.quickForm.search()
      const searchValue = searchControll.value()
      const searchValid = searchControll.valid()
      const searchKey = this._searchParamKey

      untracked(() => {
        const params = this._queryParamsSignal()
        const paramSearch = readStringParam(searchKey, params)

        if (searchValue !== paramSearch && searchValid) {
          const updatedParams = { [searchKey]: searchValue || null }

          this._updateQueryParam(updatedParams)
        }
      })
    })
  }

  //protected toggleChip(name: string): void {
  //  const params = this._queryParamsSignal()
  //  const separator = this.pathChipsSeparator()
  //  const chipsKey = this._chipsParamKey
  //  const paramChips = readStringParam(chipsKey, params)

  //  const paramChipsArray = parseArrayFromString(paramChips, separator)

  //  const toggledParamChipsArray = paramChipsArray.includes(name)
  //    ? paramChipsArray.filter(v => v !== name)
  //    : [...paramChipsArray, name]

  //  const updatedParams = {
  //    [chipsKey]:
  //      toggledParamChipsArray.length > 0
  //        ? toggledParamChipsArray.join(separator)
  //        : null
  //  }

  //  this._updateQueryParam(updatedParams)
  //}

  private _updateQueryParam(params: Record<string, string | null>): void {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true
    })
  }

  private get _searchParamKey(): string {
    return `${this.pathPrefix()}_search`
  }

  //private get _chipsParamKey(): string {
  //  return `${this.pathPrefix()}_tags`
  //}
}
