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
    sortDir = 'desc',
    status?: EssayStatus,
    keyword?: string,
    date?: Date
  ): Promise<PageResponse<Essay>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    });
    
    if (status) {
      params.append('status', status);
    }
    
    if (keyword && keyword.trim()) {
      params.append('keyword', keyword.trim());
    }
    
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      params.append('date', dateStr);
    }
    
    return apiClient.get<PageResponse<Essay>>(`/essays?${params.toString()}`);
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

