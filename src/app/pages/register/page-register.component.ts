import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-page-register',
  templateUrl: './page-register.component.html',
  styleUrl: './page-register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class RegisterPageComponent {}
