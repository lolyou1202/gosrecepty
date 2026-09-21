import { Injectable, signal, effect } from '@angular/core'
import { FilterState, FilterStateValue } from '../filter.model'

//const FILTER_STORAGE_KEY = 'app_filters'

@Injectable()
export class FilterStateService {
  //private readonly _state = signal<FilterState>(this._loadFromStorage())
  private readonly _state = signal<FilterState>({})
  private readonly _modalState = signal<FilterState>({})

  constructor() {
    //effect(() => {
    //  this._saveToStorage(this._state())
    //})
    effect(() => {
      this.setModalState({ ...this._state() })
    })
  }

  public getState(): FilterState {
    return this._state()
  }
  public getModalState(): FilterState {
    return this._modalState()
  }

  public getStateByKey(key: string): FilterStateValue {
    return this._state()[key]
  }
  public getModalStateByKey(key: string): FilterStateValue {
    return this._modalState()[key]
  }

  public setState(state: FilterState): void {
    this._state.set(state)
  }
  public setModalState(state: FilterState): void {
    this._modalState.set(state)
  }

  public setStateByKey(key: string, value: FilterStateValue): void {
    this._state.update(current => ({
      ...current,
      [key]: value
    }))
  }
  public setModalStateByKey(key: string, value: FilterStateValue): void {
    this._modalState.update(current => ({
      ...current,
      [key]: value
    }))
  }

  public deleteStateByKey(key: string): void {
    this._state.update(current => {
      const newState = { ...current }
      delete newState[key]
      return newState
    })
  }
  public deleteModalStateByKey(key: string): void {
    this._modalState.update(current => {
      const newState = { ...current }
      delete newState[key]
      return newState
    })
  }

  public clearState(): void {
    this._state.set({})
  }
  public clearModalState(): void {
    this._modalState.set({})
  }

  //private _saveToStorage(state: FilterState): void {
  //  localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(state))
  //}

  //private _loadFromStorage(): FilterState {
  //  const stored = localStorage.getItem(FILTER_STORAGE_KEY)
  //  return stored ? JSON.parse(stored) : {}
  //}
}
