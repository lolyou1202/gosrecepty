import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { IconComponent } from '../icon/icon.component'
import { ButtonLightComponent } from '../button-light/button-light.component'
import { AuthService } from '../../../core/auth/auth.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [RouterLink, RouterLinkActive, IconComponent, ButtonLightComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private _router = inject(Router)
  private _authService = inject(AuthService)

  protected isAuth = computed<boolean>(() => this._authService.isAuth())

  protected onClickLogin(): void {
    if (this.isAuth()) {
      this._authService.logout()
    } else {
      this._router.navigate(['/login'])
    }
  }
}
