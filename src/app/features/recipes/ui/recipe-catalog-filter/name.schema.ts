import { maxLength, minLength, schema, validate } from '@angular/forms/signals'

const NAME_ERRORS = {
  MIN_LENGTH: 'Название должно содержать не менее 3 символов',
  MAX_LENGTH: 'Название должно содержать не более 40 символов',
  INVALID_FORMAT: 'Название имеет некорректные символы'
}

export const nameSchema = schema<string>(name => {
  minLength(name, 3, {
    error: {
      kind: 'formError',
      message: NAME_ERRORS.MIN_LENGTH
    }
  })
  maxLength(name, 40, {
    error: {
      kind: 'formError',
      message: NAME_ERRORS.MAX_LENGTH
    }
  })
  validate(name, ({ value }) => {
    const val = value()
    if (val && !/^[А-Яа-яЁё .-]+$/.test(val)) {
      return { kind: 'formError', message: NAME_ERRORS.INVALID_FORMAT }
    }
    return null
  })
})
