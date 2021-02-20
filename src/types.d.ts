interface Credentials {
  email: string,
  password: string,
}

interface LoginResponse {
  accessToken: string,
  role: UserRole,
  userEmail: string,
}

interface UserCoordinates {
  latitude: number,
  longitude: number,
}

interface UserDetailsResponse {
  userRole: string
}

type UserRole = 'STUDENT' | 'LECTURER' | 'TRAINING_REPRESENTATIVE' | '';
