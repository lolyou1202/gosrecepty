export interface User {
  id: number
  login: string
  userName: string
}

export interface AuthResponse {
  token: string
  data: User
}