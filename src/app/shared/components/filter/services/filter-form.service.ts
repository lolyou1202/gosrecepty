import { Injectable, signal } from '@angular/core'
import {
  form,
  FieldTree,
  minLength,
  maxLength,
  pattern,
  SchemaPathTree,
  Field
} from '@angular/forms/signals'
import { FilterConfig, FilterConfigInput } from '../filter.model'

export type FilterFormInputModel = string
export type FilterFormSelectModel = string | string[]
export type FilterFormWidgetsModel =
  | FilterFormInputModel
  | FilterFormSelectModel
export type FilterFormModel = Record<string, FilterFormWidgetsModel>

@Injectable()
export class FilterFormService {
  public _showedFieldsForm: FieldTree<FilterFormModel> | null = null
  public _hiddenFieldsForm: FieldTree<FilterFormModel> | null = null

  public createForm(configs: FilterConfig[]): void {
    this._showedFieldsForm = this._createFormFromConfigs(
      configs.filter(c => !c.hide)
    )

    this._hiddenFieldsForm = this._createFormFromConfigs(
      configs.filter(c => c.hide)
    )
  }

  public getInputField(name: string): Field<string> | undefined {
    const showedField = this._showedFieldsForm?.[name]
    if (showedField) {
      return showedField as FieldTree<FilterFormInputModel>
    }

    const hiddenField = this._hiddenFieldsForm?.[name]
    if (hiddenField) {
      return hiddenField as FieldTree<FilterFormInputModel>
    }

    return
  }

  private _createFormFromConfigs(
    configs: FilterConfig[]
  ): FieldTree<FilterFormModel> | null {
    if (configs.length === 0) return null

    const model = this._buildInitialModel(configs)
    const modelSignal = signal<FilterFormModel>(model)

    return form<FilterFormModel>(modelSignal, schemaPath => {
      configs.forEach(config => {
        const fieldPath = schemaPath[config.name]
        this._applyValidatorsToField(config, fieldPath)
      })
    })
  }

  private _buildInitialModel(configs: FilterConfig[]): FilterFormModel {
    return configs.reduce((model, config) => {
      switch (config.type) {
        case 'select':
          return {
            ...model,
            [config.name]: config.multiple ? [] : ''
          }
        case 'input':
          return {
            ...model,
            [config.name]: ''
          }
      }
    }, {})
  }

  private _applyValidatorsToField(
    config: FilterConfig,
    field: SchemaPathTree<FilterFormWidgetsModel>
  ): void {
    if (config.type === 'input') {
      this._applyInputValidators(
        config as FilterConfigInput,
        field as SchemaPathTree<FilterFormInputModel>
      )
    }
    if (config.type === 'select') {
    }
  }

  private _applyInputValidators(
    config: FilterConfigInput,
    field: SchemaPathTree<FilterFormInputModel>
  ): void {
    if (config.minLength?.value) {
      minLength(field, config.minLength.value, {
        message:
          config.minLength.errorMessage ||
          `Минимальная длина поля: ${config.minLength.value}`
      })
    }

    if (config.maxLength?.value) {
      maxLength(field, config.maxLength.value, {
        message:
          config.maxLength.errorMessage ||
          `Максимальная длина поля: ${config.maxLength.value}`
      })
    }

    if (config.pattern?.value) {
      pattern(field, new RegExp(config.pattern.value), {
        message: config.pattern.errorMessage
      })
    }
  }
}
