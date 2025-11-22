import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/authStore';
import config, { logger } from '@/config';
import { showToast } from '@/utils/toast';

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
          const message = error.response.data?.message || 'Sessão expirada. Faça login novamente.';
          showToast.error(message, 'Sessão Expirada');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        if (error.response?.status === 403) {
          const message = error.response.data?.message || 'Acesso negado.';
          showToast.error(message, 'Acesso Negado');
          return Promise.reject(error);
        }

        if (error.response?.status >= 500) {
          const message = error.response.data?.message || 'Erro interno do servidor. Tente novamente.';
          showToast.error(message, 'Erro do Servidor');
          logger.error('Server Error:', {
            status: error.response.status,
            message: error.response.data?.message,
            path: error.response.data?.path,
            url: error.config?.url
          });
          return Promise.reject(error);
        }

        if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
          logger.error('Network Error:', error);
          showToast.error('Erro de conexão. Verifique se o backend está rodando em http://localhost:8080', 'Erro de Conexão');
          return Promise.reject(error);
        }

        if (error.response) {
          const errorData = error.response.data;
          let message = errorData?.message || error.response.statusText || 'Erro na requisição';

          if (error.response.status === 422 && errorData?.validationErrors) {
            const validationErrors = errorData.validationErrors;
            const firstError = Object.values(validationErrors)[0] as string;
            message = firstError || message;
            
            logger.warn('Validation Error:', {
              status: error.response.status,
              validationErrors,
              url: error.config?.url
            });
            showToast.warn(message, 'Validação');
          } else {
            logger.error('API Error:', {
              status: error.response.status,
              message,
              error: errorData?.error,
              path: errorData?.path,
              url: error.config?.url
            });
            showToast.error(message, 'Erro');
          }
        } else {
          logger.error('Unknown Error:', error);
          showToast.error('Erro desconhecido. Verifique o console para mais detalhes.', 'Erro Desconhecido');
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

