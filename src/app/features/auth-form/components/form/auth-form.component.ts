import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input
} from '@angular/core'
import { FormField, FormRoot } from '@angular/forms/signals'
import { LoginFormFactory } from '../../factorys/login-form.factory'
import { RegisterFormFactory } from '../../factorys/register-form.factory'
import { DefaultInputComponent } from '../../../../shared/ui/default-input/default-input.component'
import { ButtonDefaultComponent } from '../../../../shared/ui/button-default/button-default.component'

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
  imports: [FormRoot, FormField, DefaultInputComponent, ButtonDefaultComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AuthFormComponent {
  private readonly _loginFormFactory = inject(LoginFormFactory)
  private readonly _registerFormFactory = inject(RegisterFormFactory)

  protected readonly loginForm = this._loginFormFactory.form
  protected readonly registerForm = this._registerFormFactory.form

  public mode = input.required<'login' | 'register'>()

  protected isLogin = computed(() => this.mode() === 'login')
  protected form = computed(() =>
    this.isLogin() ? this.loginForm : this.registerForm
  )
  protected formTitle = computed(() =>
    this.isLogin() ? 'Вход' : 'Регистрация'
  )
  protected formSubmitting = computed(() => this.form()().submitting())
  protected formInvalid = computed(() => this.form()().invalid())
  protected formErrors = computed(() => this.form()().errors())
  protected formSubmitLabel = computed(() =>
    this.isLogin() ? 'Войти' : 'Зарегистрироваться'
  )

  constructor() {
    effect(() => {
      if (this.isLogin()) {
        this._loginFormFactory.resetForm()
      } else {
        this._registerFormFactory.resetForm()
      }
    })
  }
}
