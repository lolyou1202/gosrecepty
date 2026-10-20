import { inject, Injectable, signal } from '@angular/core'
import { form, apply } from '@angular/forms/signals'
import { Router } from '@angular/router'
import { firstValueFrom } from 'rxjs'
import { AuthService } from '../../../core/auth/auth.service'
import { AuthError } from '../../../core/auth/auth.errors'
import { emailSchema } from '../schemas/email.schema'
import { passwordSchema } from '../schemas/password.schema'
import { userNameSchema } from '../schemas/username.schema'
import { RegisterForm } from '../models/form.model'

@Injectable({ providedIn: 'root' })
export class RegisterFormFactory {
  private readonly _authService = inject(AuthService)
  private readonly _router = inject(Router)

  public readonly form = form(
    signal<RegisterForm>({
      userName: '',
      email: '',
      password: ''
    }),
    schema => {
      apply(schema.userName, userNameSchema)
      apply(schema.email, emailSchema)
      apply(schema.password, passwordSchema)
    },
    {
      submission: {
        action: async fields => {
          try {
            await firstValueFrom(this._authService.register(fields().value()))
            this._router.navigateByUrl('/login')
            return
          } catch (error) {
            if (error instanceof AuthError) {
              switch (error.kind) {
                case 'user_exists':
                  return [
                    {
                      kind: 'serverError',
                      message: error.message
                    },
                    {
                      kind: 'serverError',
                      fieldTree: fields.email
                    }
                  ]
                default:
                  return {
                    kind: 'serverError',
                    message: error.message
                  }
              }
            }
            return {
              kind: 'serverError',
              message: new AuthError('unknown_registration').message
            }
          }
        },
        onInvalid: fields => {
          const firstError = fields().errorSummary()[0]
          firstError?.fieldTree().focusBoundControl()
        }
      }
    }
  )

  public resetForm(): void {
    this.form().reset({ userName: '', email: '', password: '' })
  }
}
