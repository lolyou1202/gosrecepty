import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrl: './page-login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LoginPageComponent {}
