import { apiClient } from './apiClient';
import { User } from '@/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  schoolGrade?: string;
  studyGoals?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface GoogleLoginRequest {
  token: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export class AuthService {
  static async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', data);
  }

  static async loginWithGoogle(data: GoogleLoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/google', data);
  }

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', data);
  }

  static async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/forgot-password', data);
  }

  static async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/reset-password', data);
  }

  static async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  }

  static async refreshToken(): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/refresh');
  }

  static async logout(): Promise<void> {
    return apiClient.post<void>('/auth/logout');
  }
}
