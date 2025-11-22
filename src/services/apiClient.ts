import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/authStore';
import config, { logger } from '@/config';
import toast from 'react-hot-toast';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    logger.info('ApiClient initialized with baseURL:', config.api.baseUrl);

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const { token } = useAuthStore.getState();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const { clearAuth } = useAuthStore.getState();

        if (error.response?.status === 401) {
          clearAuth();
          toast.error('Sessão expirada. Faça login novamente.');
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          toast.error('Acesso negado.');
        } else if (error.response?.status >= 500) {
          toast.error('Erro interno do servidor. Tente novamente.');
        } else if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
          logger.error('Network Error:', error);
          toast.error('Erro de conexão. Verifique se o backend está rodando em http://localhost:8080');
        } else if (error.response) {
          const message = error.response.data?.message || error.response.statusText || 'Erro na requisição';
          logger.error('API Error:', {
            status: error.response.status,
            message,
            url: error.config?.url,
            baseURL: error.config?.baseURL
          });
          if (error.response.status !== 401 && error.response.status !== 403) {
            toast.error(message);
          }
        } else {
          logger.error('Unknown Error:', error);
          toast.error('Erro desconhecido. Verifique o console para mais detalhes.');
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();

