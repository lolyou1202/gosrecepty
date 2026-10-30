import {
  Injectable,
  computed,
  inject,
  signal,
  effect,
  PLATFORM_ID
} from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { CookieService } from 'ngx-cookie-service'
import {
  RecipeCatalogConfig,
  DEFAULT_RECIPE_CATALOG_CONFIG
} from './defaults.config'

@Injectable()
export class RecipeCatalogConfigService {
  private readonly _cookieService = inject(CookieService)
  private readonly _platformId = inject(PLATFORM_ID)
  private readonly _cookieKey = 'recipelist_config'

  private readonly _config = signal<RecipeCatalogConfig>(this._loadConfig())

  public readonly config = this._config.asReadonly()

  public readonly viewMode = computed(() => this._config().viewMode)

  constructor() {
    effect(() => {
      const currentConfig = this._config()
      this._saveConfig(currentConfig)
    })
  }

  public update(partialConfig: Partial<RecipeCatalogConfig>): void {
    this._config.update(current => ({
      ...current,
      ...partialConfig
    }))
  }

  private _loadConfig(): RecipeCatalogConfig {
    try {
      const saved = this._cookieService.get(this._cookieKey)
      if (saved) {
        return {
          ...DEFAULT_RECIPE_CATALOG_CONFIG,
          ...JSON.parse(saved)
        }
      }
    } catch (e) {
      console.warn('Не удалось прочитать настройки списка рецептов из куки', e)
    }
    return DEFAULT_RECIPE_CATALOG_CONFIG
  }

  private _saveConfig(config: RecipeCatalogConfig): void {
    if (isPlatformBrowser(this._platformId)) {
      this._cookieService.set(
        this._cookieKey,
        JSON.stringify(config),
        365,
        '/',
        undefined,
        true,
        'Lax'
      )
    }
  }
}
