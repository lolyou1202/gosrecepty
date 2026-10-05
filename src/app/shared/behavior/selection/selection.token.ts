import { InjectionToken } from '@angular/core'
import { FormCheckboxControl } from '@angular/forms/signals'

export const SELECTABLE_CONTROL = new InjectionToken<FormCheckboxControl>(
  'SELECTABLE_CONTROL'
)
