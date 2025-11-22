import { apiClient } from './apiClient';
import { Feedback, UserStats } from '@/types';

export class FeedbackService {
  static async getEssayFeedbacks(essayId: number): Promise<Feedback[]> {
    return apiClient.get<Feedback[]>(`/feedbacks/essay/${essayId}`);
  }

  static async getFeedback(id: number): Promise<Feedback> {
    return apiClient.get<Feedback>(`/feedbacks/${id}`);
  }

  static async getUserFeedbacks(): Promise<Feedback[]> {
    return apiClient.get<Feedback[]>('/feedbacks/user');
  }

  static async getUserStats(): Promise<UserStats> {
    return apiClient.get<UserStats>('/feedbacks/user/stats');
  }
}

