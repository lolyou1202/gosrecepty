import {
  maxLength,
  minLength,
  required,
  schema,
  validate
} from '@angular/forms/signals'
import { AuthFields } from '../models/form.model'

const PASSWORD_ERRORS = {
  REQUIRED: 'Пароль обязателен для заполнения',
  MIN_LENGTH: 'Пароль должен содержать не менее 5 символов',
  MAX_LENGTH: 'Пароль должен содержать не более 40 символов',
  ALLOWED_CHARS: 'Разрешены только латинские буквы и цифры'
}

export const passwordSchema = schema<AuthFields['password']>(password => {
  required(password, {
    error: {
      kind: 'formError',
      message: PASSWORD_ERRORS.REQUIRED
    }
  })
  minLength(password, 5, {
    error: {
      kind: 'formError',
      message: PASSWORD_ERRORS.MIN_LENGTH
    }
  })
  maxLength(password, 40, {
    error: {
      kind: 'formError',
      message: PASSWORD_ERRORS.MAX_LENGTH
    }
  })
  validate(password, ({ value }) => {
    const val = value()
    if (val && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(val)) {
      return { kind: 'formError', message: PASSWORD_ERRORS.ALLOWED_CHARS }
    }
    return null
  })
})
