import { Directive, ElementRef, inject } from '@angular/core'

@Directive({
  selector: '[appExpandableItem]',
  host: {
    '[style.flex]': '"0 0 auto"'
  }
})
export class ExpandableItemDirective {
  private readonly _el =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

  public get element(): HTMLElement {
    return this._el
  }

  public setVisible(visible: boolean): void {
    if (visible) {
      this._el.style.removeProperty('display')
      this._el.removeAttribute('inert')
      this._el.removeAttribute('aria-hidden')
    } else {
      this._el.style.setProperty('display', 'none', 'important')
      this._el.setAttribute('inert', '')
      this._el.setAttribute('aria-hidden', 'true')
    }
  }
}
