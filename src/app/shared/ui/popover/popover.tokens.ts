import { InjectionToken } from '@angular/core'
import { PopoverRef } from './popover.ref'

export const POPOVER_REF = new InjectionToken<PopoverRef>('POPOVER_REF')
export const POPOVER_DATA = new InjectionToken<unknown>('POPOVER_DATA')
