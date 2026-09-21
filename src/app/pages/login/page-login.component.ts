import { ChangeDetectionStrategy, Component } from '@angular/core'
import AuthFormComponent from '../../features/auth-form/components/form/auth-form.component'
import { ExplanationComponent } from '../../shared/ui/explanation/explanation.component'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrl: './page-login.component.scss',
  imports: [RouterLink, AuthFormComponent, ExplanationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LoginPageComponent {}
