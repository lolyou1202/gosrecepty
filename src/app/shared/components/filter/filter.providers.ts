import { Provider } from '@angular/core'
import { FilterService } from './services/filter.service'
import { FilterStateService } from './services/filter-state.service'
import { FilterConfigService } from './services/filter-config.service'

export const FILTER_PROVIDERS: Provider[] = [
  FilterService,
  FilterStateService,
  FilterConfigService
]
