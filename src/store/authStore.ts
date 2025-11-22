import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { AuthService, LoginRequest, RegisterRequest, ForgotPasswordRequest } from '@/services/authService';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (userData: Partial<User>) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      login: async (data: LoginRequest) => {
        try {
          set({ isLoading: true });
          const response = await AuthService.login(data);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success('Login realizado com sucesso!');
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Erro ao fazer login';
          toast.error(message);
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        try {
          set({ isLoading: true });
          const response = await AuthService.register(data);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success('Cadastro realizado com sucesso!');
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Erro ao fazer cadastro';
          toast.error(message);
          throw error;
        }
      },

      forgotPassword: async (data: ForgotPasswordRequest) => {
        try {
          set({ isLoading: true });
          const response = await AuthService.forgotPassword(data);
          set({ isLoading: false });
          toast.success(response.message);
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Erro ao solicitar recuperação de senha';
          toast.error(message);
          throw error;
        }
      },

      logout: async () => {
        try {
          await AuthService.logout();
        } catch (error) {
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          toast.success('Logout realizado com sucesso!');
        }
      },

      getCurrentUser: async () => {
        try {
          const user = await AuthService.getCurrentUser();
          set({ user });
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

