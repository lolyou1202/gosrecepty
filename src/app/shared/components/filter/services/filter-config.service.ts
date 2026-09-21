import { Injectable, signal } from '@angular/core'
import { FilterConfig } from '../filter.model'

@Injectable()
export class FilterConfigService {
  private readonly _configs = signal<FilterConfig[]>([])

  public setConfig(configs: FilterConfig[]): void {
    this._configs.set(configs)
  }

  public getConfigs(): FilterConfig[] {
    return this._configs()
  }

  public getConfigByName(name: string): FilterConfig | null {
    return this._configs().find(c => c.name === name) ?? null
  }
}
