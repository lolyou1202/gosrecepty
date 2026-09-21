import { Injectable } from '@angular/core'
import {
  FilterChip,
  FilterConfig,
  FilterConfigSelectOption,
  FilterConfigType,
  FilterStateValue
} from '../filter.model'

@Injectable()
export class FilterChipBuilder {
  public build(config: FilterConfig, value: FilterStateValue): FilterChip {
    return {
      name: config.name,
      label: this._formatDisplayValue({
        configType: config.type,
        configOptions: config.selectOptions || [],
        value
      })
    }
  }

  private _formatDisplayValue({
    configType,
    configOptions,
    value
  }: {
    configType: FilterConfigType
    configOptions: FilterConfigSelectOption[]
    value: FilterStateValue
  }): string {
    switch (configType) {
      case 'multiselect':
        return this._formatMultiselect({
          configOptions,
          value
        })

      case 'boolean':
        return this._formatBoolean({ value })

      case 'string':
        return this._formatString({
          configOptions,
          value
        })

      default:
        return ''
    }
  }

  private _formatMultiselect({
    configOptions,
    value
  }: {
    configOptions: FilterConfigSelectOption[]
    value: FilterStateValue
  }): string {
    if (!Array.isArray(value)) {
      return ''
    }
    return value
      .map(v =>
        this._findOptionLabel({
          configOptions,
          value: v
        })
      )
      .filter(Boolean)
      .join(', ')
  }

  private _formatBoolean({ value }: { value: FilterStateValue }): string {
    if (typeof value !== 'boolean') {
      return ''
    }
    return value ? 'Да' : 'Нет'
  }

  private _formatString({
    configOptions,
    value
  }: {
    configOptions: FilterConfigSelectOption[]
    value: FilterStateValue
  }): string {
    if (typeof value !== 'string') {
      return ''
    }

    if (configOptions) {
      const optionLabel = this._findOptionLabel({
        configOptions,
        value
      })
      if (optionLabel) {
        return optionLabel
      }
    }

    return ''
  }

  private _findOptionLabel({
    configOptions,
    value
  }: {
    configOptions: FilterConfigSelectOption[]
    value: string
  }): string | null {
    const option = configOptions.find(opt => opt.value === value)

    return option?.label || null
  }
}
