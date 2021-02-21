export interface Credentials {
  email: string,
  password: string,
}

export type UserRole = 'STUDENT' | 'LECTURER' | 'TRAINING_REPRESENTATIVE' | '';

export interface LoginResponse {
  accessToken: string,
  role: UserRole,
  userEmail: string,
}

export interface UserCoordinates {
  latitude: number,
  longitude: number,
}

export interface UserDetailsResponse {
  userRole: string
}
