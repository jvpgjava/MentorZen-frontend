import { apiClient } from './apiClient';
import { User } from '@/types';

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  schoolGrade?: string;
  studyGoals?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export class ProfileService {
  static async updateProfile(data: UpdateProfileRequest): Promise<User> {
    return apiClient.put<User>('/profile', data);
  }

  static async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>('/profile/password', data);
  }

  static async uploadProfilePicture(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post<User>('/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static async deleteAccount(): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>('/profile');
  }
}
