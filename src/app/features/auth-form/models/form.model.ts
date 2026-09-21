export interface AuthFields {
  userName: string
  email: string
  password: string
}

export type LoginForm = Pick<AuthFields, 'email' | 'password'>
export type RegisterForm = Pick<AuthFields, 'userName' | 'email' | 'password'>
