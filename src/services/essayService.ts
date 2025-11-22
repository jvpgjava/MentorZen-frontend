import { apiClient } from './apiClient';
import {
  Essay,
  EssayCreateRequest,
  EssayStatus,
  PageResponse,
} from '@/types';

export class EssayService {
  static async createEssay(data: EssayCreateRequest): Promise<Essay> {
    return apiClient.post<Essay>('/essays', data);
  }

  static async getEssay(id: number): Promise<Essay> {
    return apiClient.get<Essay>(`/essays/${id}`);
  }

  static async updateEssay(id: number, data: EssayCreateRequest): Promise<Essay> {
    return apiClient.put<Essay>(`/essays/${id}`, data);
  }

  static async deleteEssay(id: number): Promise<void> {
    return apiClient.delete<void>(`/essays/${id}`);
  }

  static async getUserEssays(
    page = 0,
    size = 10,
    sortBy = 'updatedAt',
    sortDir = 'desc'
  ): Promise<PageResponse<Essay>> {
    return apiClient.get<PageResponse<Essay>>(
      `/essays?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  }

  static async getEssaysByStatus(status: EssayStatus): Promise<Essay[]> {
    return apiClient.get<Essay[]>(`/essays/status/${status}`);
  }

  static async submitForAnalysis(id: number): Promise<Essay> {
    return apiClient.post<Essay>(`/essays/${id}/submit`);
  }

  static async searchEssays(
    keyword: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<Essay>> {
    return apiClient.get<PageResponse<Essay>>(
      `/essays/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
    );
  }
}

