import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
    '1º Ano',
    '2º Ano',
    '3º Ano',
    'Cursinho',
    'Formado',
    'Outro'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof RegisterRequest]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
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
    <div className="min-h-screen flex items-center justify-center zen-gradient py-8">
      <div className="bg-white p-8 rounded-lg zen-shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/assets/zen-logo.png"
              alt="Zen Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold zen-gradient-text mb-2">
            Criar Conta
          </h1>
          <p className="text-gray-600">
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Seu nome completo"
              disabled={isLoading}
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="seu@email.com"
              disabled={isLoading}
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Mínimo 6 caracteres"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="schoolGrade" className="block text-sm font-medium text-gray-700 mb-1">
              Série/Ano (Opcional)
            </label>
            <select
              id="schoolGrade"
              name="schoolGrade"
              value={formData.schoolGrade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
            >
              <option value="">Selecione sua série</option>
              {schoolGrades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${errors.studyGoals ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ex: Passar no ENEM, melhorar redação..."
              disabled={isLoading}
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
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="text-gray-500 text-sm">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Fazer login
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Hackathon Gemini for Education 2024</p>
          <p>Equipe FloWrite</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
