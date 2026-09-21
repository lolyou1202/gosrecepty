import {
  maxLength,
  minLength,
  required,
  schema,
  validate
} from '@angular/forms/signals'
import { AuthFields } from '../models/form.model'

const USERNAME_ERRORS = {
  REQUIRED: 'Псевдоним обязателен для заполнения',
  MIN_LENGTH: 'Псевдоним должен содержать не менее 3 символов',
  MAX_LENGTH: 'Псевдоним должен содержать не более 40 символов',
  ALLOWED_CHARS:
    'Разрешены только русские буквы, латинские буквы, пробелы и точки',
  NO_START_DOT: 'Псевдоним не может начинаться с точки',
  NO_END_DOT: 'Псевдоним не может заканчиваться на точку',
  NO_CONSECUTIVE_DOTS: 'Псевдоним не может содержать две точки подряд',
  NO_START_SPACE: 'Псевдоним не может начинаться с пробела',
  NO_END_SPACE: 'Псевдоним не может заканчиваться на пробел',
  NO_CONSECUTIVE_SPACES: 'Псевдоним не может содержать два пробела подряд',
  MUST_CONTAIN_LETTER: 'Псевдоним должен содержать хотя бы одну букву'
}

export const userNameSchema = schema<AuthFields['userName']>(username => {
  required(username, {
    error: {
      kind: 'formError',
      message: USERNAME_ERRORS.REQUIRED
    }
  })
  minLength(username, 3, {
    error: {
      kind: 'formError',
      message: USERNAME_ERRORS.MIN_LENGTH
    }
  })
  maxLength(username, 40, {
    error: {
      kind: 'formError',
      message: USERNAME_ERRORS.MAX_LENGTH
    }
  })
  validate(username, ({ value }) => {
    const val = value()
    if (val && !/^[A-Za-zА-Яа-яЁё .]+$/.test(val)) {
      return { kind: 'formError', message: USERNAME_ERRORS.ALLOWED_CHARS }
    }
    return null
  })
  validate(username, ({ value }) => {
    const val = value()
    if (val && val.startsWith('.')) {
      return { kind: 'formError', message: USERNAME_ERRORS.NO_START_DOT }
    }
    return null
  })
  validate(username, ({ value }) => {
    const val = value()
    if (val && val.endsWith('.')) {
      return { kind: 'formError', message: USERNAME_ERRORS.NO_END_DOT }
    }
    return null
  })
  validate(username, ({ value }) => {
    const val = value()
    if (val && /\.\./.test(val)) {
      return { kind: 'formError', message: USERNAME_ERRORS.NO_CONSECUTIVE_DOTS }
    }
    return null
  })
  validate(username, ({ value }) => {
    const val = value()
    if (val && val.startsWith(' ')) {
      return { kind: 'formError', message: USERNAME_ERRORS.NO_START_SPACE }
    }
    return null
  })
  validate(username, ({ value }) => {
    const val = value()
    if (val && val.endsWith(' ')) {
      return { kind: 'formError', message: USERNAME_ERRORS.NO_END_SPACE }
    }
    return null
  })
  validate(username, ({ value }) => {
    const val = value()
    if (val && /\s{2}/.test(val)) {
      return {
        kind: 'formError',
        message: USERNAME_ERRORS.NO_CONSECUTIVE_SPACES
      }
    }
    return null
  })
  validate(username, ({ value }) => {
    const val = value()
    if (val && !/[A-Za-zА-Яа-яЁё]/.test(val)) {
      return { kind: 'formError', message: USERNAME_ERRORS.MUST_CONTAIN_LETTER }
    }
    return null
  })
})
