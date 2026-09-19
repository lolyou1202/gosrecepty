export class AuthError extends Error {
  constructor(public kind: keyof typeof API_AUTH_ERROR_MESSAGES) {
    super(API_AUTH_ERROR_MESSAGES[kind])
    this.name = 'AuthError'
  }
}

const API_AUTH_ERROR_MESSAGES = {
  invalid_token: 'Токен не валиден',
  user_exists: 'Пользователь с таким логином уже существует',
  invalid_credentials: 'Неверный логин или пароль',
  unknown_registration: 'Произошла ошибка при регистрации',
  unknown_login: 'Произошла ошибка при входе',
  server: 'Ошибка сервера'
}
