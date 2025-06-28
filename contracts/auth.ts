

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName?: string
  email: string
  password: string
  role?: string
  parent?: number
}

export interface UpdateProfileRequest {
  fullName?: string
  email?: string
  role?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: any
} 