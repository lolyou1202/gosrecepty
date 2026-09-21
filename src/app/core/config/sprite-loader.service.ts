import { Injectable, inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'

@Injectable({ providedIn: 'root' })
export class SpriteLoaderService {
  private document = inject(DOCUMENT)
  private loaded = false

  public async loadSprite(): Promise<void> {
    if (this.loaded) {
      return Promise.resolve()
    }

    try {
			const response = await fetch('/sprite.svg')
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			const svg = await response.text()
			const div = this.document.createElement('div')
			div.style.display = 'none'
			div.innerHTML = svg
			this.document.body.appendChild(div)
			this.loaded = true
		} catch (err) {
			console.error('❌ Не удалось загрузить SVG спрайт:', err)
		}
  }
}
