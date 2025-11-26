import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { useAuthStore } from '@/store/authStore';
import { RegisterRequest, GoogleRegisterRequest } from '@/services/authService';

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

const Register: React.FC = () => {
  const { register, registerWithGoogle, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    schoolGrade: '',
    studyGoals: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterRequest>>({});
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [showGoogleRegisterDialog, setShowGoogleRegisterDialog] = useState(false);
  const [googleToken, setGoogleToken] = useState<string>('');
  const [googleRegisterData, setGoogleRegisterData] = useState<{ schoolGrade: string; studyGoals: string }>({
    schoolGrade: '',
    studyGoals: '',
  });

  const schoolGrades = [
    { label: 'Selecione sua série', value: '' },
    { label: '1º Ano', value: '1º Ano' },
    { label: '2º Ano', value: '2º Ano' },
    { label: '3º Ano', value: '3º Ano' },
    { label: 'Cursinho', value: 'Cursinho' },
    { label: 'Formado', value: 'Formado' },
    { label: 'Outro', value: 'Outro' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof RegisterRequest]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSchoolGradeChange = (value: string) => {
    setFormData(prev => ({ ...prev, schoolGrade: value }));
    if (errors.schoolGrade) {
      setErrors(prev => ({ ...prev, schoolGrade: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterRequest> = {};

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email deve ter formato válido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.studyGoals && formData.studyGoals.length > 500) {
      newErrors.studyGoals = 'Objetivos devem ter no máximo 500 caracteres';
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
      await register(formData);
    } catch (error) {
    }
  };

  const handleGoogleSignIn = async (credential: string) => {
    setGoogleToken(credential);
    setShowGoogleRegisterDialog(true);
  };

  const handleGoogleRegisterSubmit = async () => {
    try {
      console.log('Iniciando registro com Google...');
      const request: GoogleRegisterRequest = {
        token: googleToken,
        schoolGrade: googleRegisterData.schoolGrade || undefined,
        studyGoals: googleRegisterData.studyGoals || undefined,
      };
      await registerWithGoogle(request);
      console.log('Registro com Google concluído com sucesso');
      setShowGoogleRegisterDialog(false);
      setGoogleToken('');
      setGoogleRegisterData({ schoolGrade: '', studyGoals: '' });
    } catch (error: any) {
      console.error('Erro no registro com Google:', error);
      // O erro já é tratado pelo apiClient, não precisa mostrar toast aqui
    }
  };

  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

    console.log('Google Client ID carregado:', googleClientId ? 'SIM' : 'NÃO');
    console.log('Valor do Client ID:', googleClientId);

    if (!googleClientId) {
      console.warn('Google Client ID não configurado');
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
      className="min-h-screen flex items-center justify-center py-8"
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
            Criar Conta
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Junte-se ao Mentor Zen e melhore sua escrita
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#88a7e8] text-base ${errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Seu nome completo"
              disabled={isLoading}
              style={{ fontSize: '16px' }}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

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
              placeholder="Mínimo 6 caracteres"
              disabled={isLoading}
              style={{ fontSize: '16px' }}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="schoolGrade" className="block text-sm font-medium text-gray-700 mb-1">
              Série/Ano (Opcional)
            </label>
            <Dropdown
              value={formData.schoolGrade}
              options={schoolGrades}
              onChange={(e) => handleSchoolGradeChange(e.value)}
              placeholder="Selecione sua série"
              className="w-full h-12 text-base border-2 border-gray-200 focus:border-[#88a7e8] rounded-lg custom-dropdown"
              panelClassName="text-base"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="studyGoals" className="block text-sm font-medium text-gray-700 mb-1">
              Objetivos de Estudo (Opcional)
            </label>
            <textarea
              id="studyGoals"
              name="studyGoals"
              value={formData.studyGoals}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#88a7e8] resize-none text-base ${errors.studyGoals ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ex: Passar no ENEM, melhorar redação..."
              disabled={isLoading}
              style={{ fontSize: '16px' }}
            />
            {errors.studyGoals && (
              <p className="text-red-500 text-sm mt-1">{errors.studyGoals}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.studyGoals?.length || 0}/500 caracteres
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4472d6] hover:bg-[#B5C870] disabled:bg-[#D4E49A] text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
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

        <div className="mt-6 text-center">
          <div className="text-gray-500 text-sm">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-[#8FA86B] hover:text-[#7A9555] font-medium"
            >
              Fazer login
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="text-[#8FA86B]">Equipe FloWrite</p>
        </div>
      </div>

      <Dialog
        header="Complete seu cadastro"
        visible={showGoogleRegisterDialog}
        onHide={() => {
          setShowGoogleRegisterDialog(false);
          setGoogleToken('');
          setGoogleRegisterData({ schoolGrade: '', studyGoals: '' });
        }}
        style={{ width: '90%', maxWidth: '500px' }}
        className="p-fluid"
      >
        <div className="space-y-4 mt-4">
          <p className="text-gray-600 text-sm">
            Preencha as informações abaixo para completar seu cadastro (campos opcionais):
          </p>

          <div>
            <label htmlFor="googleSchoolGrade" className="block text-sm font-medium text-gray-700 mb-1">
              Série/Ano (Opcional)
            </label>
            <Dropdown
              value={googleRegisterData.schoolGrade}
              options={schoolGrades}
              onChange={(e) => setGoogleRegisterData(prev => ({ ...prev, schoolGrade: e.value }))}
              placeholder="Selecione sua série"
              className="w-full h-12 text-base border-2 border-gray-200 focus:border-[#C7D882] rounded-lg custom-dropdown"
              panelClassName="text-base"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="googleStudyGoals" className="block text-sm font-medium text-gray-700 mb-1">
              Objetivos de Estudo (Opcional)
            </label>
            <InputTextarea
              id="googleStudyGoals"
              value={googleRegisterData.studyGoals}
              onChange={(e) => setGoogleRegisterData(prev => ({ ...prev, studyGoals: e.target.value }))}
              rows={3}
              className="w-full text-base"
              placeholder="Ex: Passar no ENEM, melhorar redação..."
              disabled={isLoading}
              maxLength={500}
            />
            <p className="text-gray-500 text-xs mt-1">
              {googleRegisterData.studyGoals?.length || 0}/500 caracteres
            </p>
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <button
              type="button"
              onClick={() => {
                setShowGoogleRegisterDialog(false);
                setGoogleToken('');
                setGoogleRegisterData({ schoolGrade: '', studyGoals: '' });
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleGoogleRegisterSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-[#9ea04f] hover:bg-[#B5C870] disabled:bg-[#D4E49A] text-white rounded-lg transition-colors"
            >
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Register;
