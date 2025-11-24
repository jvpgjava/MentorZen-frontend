import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { useAuthStore } from '@/store/authStore';
import { RegisterRequest } from '@/services/authService';

const Register: React.FC = () => {
  const { register, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    schoolGrade: '',
    studyGoals: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterRequest>>({});

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
              src="/assets/zen-logo.png"
              alt="Zen Logo"
              className="w-20 h-20 lg:w-24 lg:h-24 object-contain"
            />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold zen-gradient-text mb-2">
            Zen
          </h1>
          <p className="text-gray-600 text-lg">
            Criar Conta
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Junte-se ao Zen e melhore sua escrita
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D882] text-base ${errors.name ? 'border-red-500' : 'border-gray-300'
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D882] text-base ${errors.email ? 'border-red-500' : 'border-gray-300'
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D882] text-base ${errors.password ? 'border-red-500' : 'border-gray-300'
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
              className="w-full h-12 text-base border-2 border-gray-200 focus:border-[#C7D882] rounded-lg custom-dropdown"
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D882] resize-none text-base ${errors.studyGoals ? 'border-red-500' : 'border-gray-300'
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
            className="w-full bg-[#9ea04f] hover:bg-[#B5C870] disabled:bg-[#D4E49A] text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

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
    </div>
  );
};

export default Register;
