import { inject, Injectable, signal } from '@angular/core'
import { form, apply } from '@angular/forms/signals'
import { ActivatedRoute, Router } from '@angular/router'
import { firstValueFrom } from 'rxjs'
import { AuthService } from '../../../core/auth/auth.service'
import { AuthError } from '../../../core/auth/auth.errors'
import { emailSchema } from '../schemas/email.schema'
import { passwordSchema } from '../schemas/password.schema'
import { LoginForm } from '../models/form.model'

@Injectable({ providedIn: 'root' })
export class LoginFormFactory {
  private readonly _authService = inject(AuthService)
  private readonly _router = inject(Router)
  private readonly _route = inject(ActivatedRoute)

  public readonly form = form(
    signal<LoginForm>({
      email: '',
      password: ''
    }),
    schema => {
      apply(schema.email, emailSchema)
      apply(schema.password, passwordSchema)
    },
    {
      submission: {
        action: async fields => {
          try {
            await firstValueFrom(this._authService.login(fields().value()))
            this._router.navigateByUrl(
              this._route.snapshot.queryParamMap.get('rUrl') ?? '/recipes'
            )
            return
          } catch (error) {
            if (error instanceof AuthError) {
              switch (error.kind) {
                case 'invalid_credentials':
                  return {
                    kind: 'serverError',
                    message: error.message
                  }
                default:
                  return {
                    kind: 'serverError',
                    message: error.message
                  }
              }
            }
            return {
              kind: 'serverError',
              message: new AuthError('unknown_login').message
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
    this.form().reset({ email: '', password: '' })
  }
}
