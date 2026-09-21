import { ChangeDetectionStrategy, Component } from '@angular/core'
import AuthFormComponent from '../../features/auth-form/components/form/auth-form.component'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-page-register',
  templateUrl: './page-register.component.html',
  styleUrl: './page-register.component.scss',
  imports: [RouterLink, AuthFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class RegisterPageComponent {}
