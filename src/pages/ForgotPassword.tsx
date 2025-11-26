import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ForgotPasswordRequest } from '@/services/authService';

const ForgotPassword: React.FC = () => {
  const { forgotPassword, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<ForgotPasswordRequest>({
    email: '',
  });
  const [errors, setErrors] = useState<Partial<ForgotPasswordRequest>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof ForgotPasswordRequest]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ForgotPasswordRequest> = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email deve ter formato válido';
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
      await forgotPassword(formData);
      setIsSuccess(true);
    } catch (error) {
    }
  };

  if (isSuccess) {
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
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/assets/zen-logo.svg"
              alt="Mentor Zen Logo"
              className="w-20 h-20 lg:w-24 lg:h-24 object-contain"
            />
          </div>

          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Enviado!
            </h1>

            <p className="text-gray-600 mb-6">
              Enviamos um link de recuperação para <strong>{formData.email}</strong>.
              Verifique sua caixa de entrada e spam.
            </p>

            <div className="bg-[#F5EFE9] border border-[#88a7e8] rounded-lg p-4 mb-6">
              <p className="text-[#162A41] text-sm">
                <strong>Nota:</strong> O link expira em 1 hora por segurança.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full bg-[#88a7e8] hover:bg-[#63da8e] text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Voltar ao Login
            </Link>

            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({ email: '' });
              }}
              className="block w-full text-[#4472d6] hover:text-[#88a7e8] font-medium py-2"
            >
              Enviar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl lg:text-5xl font-bold mb-2">
            <span className="text-[#4472d6]">Mentor </span>
            <span className="text-[#63da8e]">Zen</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Recuperar Senha
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Digite seu email para receber o link de recuperação
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#88a7e8] hover:bg-[#63da8e] disabled:bg-[#D4E49A] text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-[#4472d6] hover:text-[#88a7e8] text-sm"
          >
            ← Voltar ao login
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="text-[#4472d6]">Equipe FloWrite</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
