import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { AuthService, LoginRequest, RegisterRequest, ForgotPasswordRequest } from '@/services/authService';
import { showToast } from '@/utils/toast';

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
          showToast.success('Login realizado com sucesso!');
        } catch (error: any) {
          set({ isLoading: false });
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
          showToast.success('Cadastro realizado com sucesso!');
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      forgotPassword: async (data: ForgotPasswordRequest) => {
        try {
          set({ isLoading: true });
          const response = await AuthService.forgotPassword(data);
          set({ isLoading: false });
          showToast.success(response.message || 'Email de recuperação enviado com sucesso!', 'Email Enviado');
        } catch (error: any) {
          set({ isLoading: false });
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
          showToast.success('Logout realizado com sucesso!');
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

