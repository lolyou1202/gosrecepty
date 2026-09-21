import { Injectable, computed, inject } from '@angular/core'
import {  FilterConfig, FilterStateValue } from '../filter.model'
import { FilterStateService } from './filter-state.service'
import { FilterConfigService } from './filter-config.service'

@Injectable()
export class FilterService {
  private readonly _stateService = inject(FilterStateService)
  private readonly _configService = inject(FilterConfigService)

  public readonly configs = this._configService.getConfigs()

  public readonly activeFilters = computed<string[]>(() => {
    const state = this._stateService.getState()
    return Object.keys(state).filter(key => this.isFilterActive(key))
  })

  public readonly activeFiltersCount = computed<number>(
    () => this.activeFilters().length
  )

  //public readonly chips = computed<FilterChip[]>(() => {
  //  const chipsArr = [] as FilterChip[]

  //  this.activeFilters().forEach(key => {
  //    const config = this._configService.getConfigByName(key)
  //    if (!config) return

  //    const { type, chipLabel } = config
  //    const stateValue = this._stateService.state()[key]

  //    switch (type) {
  //      case 'input':
  //        if (chipLabel) {
  //          chipsArr.push({
  //            label: chipLabel,
  //            name: key
  //          })
  //        }
  //        break
  //      case 'multiselect':
  //        if (Array.isArray(stateValue) && stateValue.length > 0) {
  //          stateValue.forEach(value => {
  //            if (chipLabel) {
  //              chipsArr.push({
  //                label: chipLabel,
  //                name: key
  //              })
  //            }
  //          })
  //        }
  //        break
  //      default:
  //        return
  //    }
  //  })

  //  return chipsArr
  //})

  public isFilterActive(key: string): boolean {
    const state = this._stateService.getState()
    return state[key] !== undefined
  }

  public setConfigs(configs: FilterConfig[]): void {
    this._configService.setConfig(configs)
  }

  public setFilterByKey(key: string, value: FilterStateValue): void {
    this._stateService.setStateByKey(key, value)
  }

  public applyModalFilters(): void {
    const modalState = this._stateService.getModalState()
    this._stateService.setState(modalState)
  }

  public clearFilter(key: string): void {
    this._stateService.deleteStateByKey(key)
  }

  public clearAllFilters(): void {
    this._stateService.clearState()
    //this.clearModalFilters()
  }

  public clearModalFilters(): void {
    this._stateService.clearModalState()
  }

  //public resetModalFilters(): void {
  //  this._stateService.setModalState(this.state())
  //}

  public updateBooleanFilter(key: string, setFalse?: boolean): void {
    const config = this._configService.getConfigByName(key)
    if (!config) return

    const isHide = config.hide

    const state = isHide
      ? this._stateService.getModalState()
      : this._stateService.getState()

    const isActive = state[key] === true

    if (isActive) {
      if (setFalse) {
        isHide
          ? this._stateService.setModalStateByKey(key, false)
          : this._stateService.setStateByKey(key, false)
      } else {
        isHide
          ? this._stateService.deleteModalStateByKey(key)
          : this._stateService.deleteStateByKey(key)
      }
    } else {
      isHide
        ? this._stateService.setModalStateByKey(key, true)
        : this._stateService.setStateByKey(key, true)
    }
  }

  public updateMultiselectFilter(key: string, value: string | string[]): void {
    const config = this._configService.getConfigByName(key)
    if (!config) return

    const isHide = config.hide

    if (Array.isArray(value)) {
      isHide
        ? this._stateService.setModalStateByKey(key, value)
        : this._stateService.setStateByKey(key, value)
      return
    }

    const state = isHide
      ? this._stateService.getModalState()
      : this._stateService.getState()

    const currentValue = state[key]

    if (!Array.isArray(currentValue)) {
      return
    }

    const exists = currentValue.includes(value)
    const newArray = exists
      ? currentValue.filter(v => v !== value)
      : [...currentValue, value]

    if (newArray.length === 0) {
      isHide
        ? this._stateService.deleteModalStateByKey(key)
        : this._stateService.deleteStateByKey(key)
    } else {
      isHide
        ? this._stateService.setModalStateByKey(key, newArray)
        : this._stateService.setStateByKey(key, newArray)
    }
  }

  public updateStringFilter(key: string, value: string): void {
    const config = this._configService.getConfigByName(key)
    if (!config) return

    const isHide = config.hide

    if (value.trim().length > 0) {
      isHide
        ? this._stateService.setModalStateByKey(key, value)
        : this._stateService.setStateByKey(key, value)
    } else {
      isHide
        ? this._stateService.deleteModalStateByKey(key)
        : this._stateService.deleteStateByKey(key)
    }
  }
}
