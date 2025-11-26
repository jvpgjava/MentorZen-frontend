import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LoginRequest } from '@/services/authService';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, config: { theme?: string; size?: string; width?: number }) => void;
        };
      };
    };
  }
}

const Login: React.FC = () => {
  const { login, loginWithGoogle, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginRequest>>({});
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof LoginRequest]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginRequest> = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email deve ter formato válido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
    } catch (error) {
    }
  };

  const handleGoogleSignIn = async (credential: string) => {
    try {
      console.log('Iniciando login com Google...');
      await loginWithGoogle({ token: credential });
      console.log('Login com Google concluído com sucesso');
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
    }
  };

  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

    console.log('Google Client ID carregado:', googleClientId ? 'SIM' : 'NÃO');
    console.log('Valor do Client ID:', googleClientId);

    if (!googleClientId) {
      console.error('Google Client ID não configurado!');
      console.error('Crie um arquivo .env na raiz do projeto com:');
      return;
    }

    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      if (window.google && googleButtonRef.current) {
        console.log('Inicializando Google Sign-In com Client ID:', googleClientId);
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response) => {
            console.log('Google Sign-In callback recebido');
            handleGoogleSignIn(response.credential);
          },
        });

        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: googleButtonRef.current.offsetWidth || 300,
          });
          console.log('Botão Google renderizado');
        }
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Script do Google Identity Services carregado');
      if (window.google && googleButtonRef.current) {
        console.log('Inicializando Google Sign-In com Client ID:', googleClientId);
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response) => {
            console.log('Google Sign-In callback recebido');
            handleGoogleSignIn(response.credential);
          },
        });

        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: googleButtonRef.current.offsetWidth || 300,
          });
          console.log('Botão Google renderizado');
        }
      }
    };
    document.head.appendChild(script);

    return () => {
      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url(/wallpaper-login/FundoLogin.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/assets/zen-logo.svg"
              alt="Mentor Zen Logo"
              className="w-20 h-20 lg:w-24 lg:h-24 object-contain"
            />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold zen-gradient-text mb-2">
            Mentor Zen
          </h1>
          <p className="text-gray-600 text-lg">
            Escrita Consciente com IA
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#88a7e8] text-base ${errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="seu@email.com"
              disabled={isLoading}
              style={{ fontSize: '16px' }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#88a7e8] text-base ${errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Sua senha"
              disabled={isLoading}
              style={{ fontSize: '16px' }}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#88a7e8] hover:bg-[#B5C870] disabled:bg-[#D4E49A] text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <div ref={googleButtonRef} className="w-full flex justify-center"></div>
        </div>

        <div className="mt-6 text-center space-y-2">
          <Link
            to="/forgot-password"
            className="text-[#8FA86B] hover:text-[#7A9555] text-sm"
          >
            Esqueceu sua senha?
          </Link>

          <div className="text-gray-500 text-sm">
            Não tem uma conta?{' '}
            <Link
              to="/register"
              className="text-[#8FA86B] hover:text-[#7A9555] font-medium"
            >
              Cadastre-se
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-[#8FA86B]">Equipe FloWrite</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
