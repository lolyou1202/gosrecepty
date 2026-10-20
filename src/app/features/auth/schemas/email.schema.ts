import { required, maxLength, validate, schema } from '@angular/forms/signals'
import { AuthFields } from '../models/form.model'

const EMAIL_ERRORS = {
  REQUIRED: 'E-mail обязателен для заполнения',
  MAX_LENGTH: 'E-mail должен содержать не более 40 символов',
  INVALID_FORMAT: 'E-mail имеет некорректный вид'
}

/**
 * Регулярное выражение для проверки email
 * Разрешает латиницу, цифры, точки, дефисы
 * Требует наличие @ и домена с точкой и минимум 2 буквами в зоне
 */
const EMAIL_PATTERN = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const emailSchema = schema<AuthFields['email']>(email => {
  required(email, {
    error: {
      kind: 'formError',
      message: EMAIL_ERRORS.REQUIRED
    }
  })
  maxLength(email, 40, {
    error: {
      kind: 'formError',
      message: EMAIL_ERRORS.MAX_LENGTH
    }
  })
  validate(email, ({ value }) => {
    const val = value()
    if (val && !EMAIL_PATTERN.test(val)) {
      return { kind: 'formError', message: EMAIL_ERRORS.INVALID_FORMAT }
    }
    return null
  })
})
