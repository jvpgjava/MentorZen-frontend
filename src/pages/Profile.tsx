import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { useAuthStore } from '@/store/authStore';
import { ProfileService, UpdateProfileRequest, ChangePasswordRequest } from '@/services/profileService';
import { showToast } from '@/utils/toast';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, clearAuth } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'danger'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [profileData, setProfileData] = useState<UpdateProfileRequest>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    schoolGrade: user?.schoolGrade || '',
    studyGoals: user?.studyGoals || '',
  });

  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const schoolGrades = [
    { label: 'Selecione sua série', value: '' },
    { label: '1º Ano', value: '1º Ano' },
    { label: '2º Ano', value: '2º Ano' },
    { label: '3º Ano', value: '3º Ano' },
    { label: 'Cursinho', value: 'Cursinho' },
    { label: 'Formado', value: 'Formado' },
    { label: 'Outro', value: 'Outro' }
  ];

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const updatedUser = await ProfileService.updateProfile(profileData);

      updateUser(updatedUser);

      showToast.success('Perfil atualizado com sucesso');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao atualizar perfil';
      showToast.error(message || 'Erro ao atualizar perfil', 'Erro ao Atualizar');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== confirmPassword) {
      showToast.warn('A nova senha e a confirmação devem ser iguais', 'Validação');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast.warn('A senha deve ter pelo menos 6 caracteres', 'Validação');
      return;
    }

    try {
      setIsLoading(true);
      await ProfileService.changePassword(passwordData);

      setPasswordData({ currentPassword: '', newPassword: '' });
      setConfirmPassword('');

      showToast.success('Senha alterada com sucesso');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao alterar senha';
      showToast.error(message || 'Erro ao alterar senha', 'Erro ao Alterar Senha');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      showToast.warn('Arquivo muito grande. O tamanho máximo permitido é 25MB', 'Arquivo Inválido');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast.warn('Formato inválido. Selecione um arquivo de imagem (JPG, PNG, etc)', 'Formato Inválido');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setImageError(false);
      const updatedUser = await ProfileService.uploadProfilePicture(file);

      // Atualizar o usuário completo, não apenas parcial
      updateUser({
        ...updatedUser,
        profilePictureUrl: updatedUser.profilePictureUrl
      });

      // Forçar re-render da imagem
      setImageError(false);

      showToast.success('Foto de perfil atualizada com sucesso');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer upload da foto';
      showToast.error(message || 'Erro ao atualizar foto de perfil', 'Erro ao Atualizar Foto');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await ProfileService.deleteAccount();

      clearAuth();
      showToast.success('Conta deletada com sucesso');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao deletar conta';
      showToast.error(message || 'Erro ao deletar conta', 'Erro ao Deletar Conta');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Resetar erro de imagem quando a URL mudar
    setImageError(false);
  }, [user?.profilePictureUrl]);

  const getProfilePictureUrl = () => {
    if (user?.profilePictureUrl) {
      if (user.profilePictureUrl.startsWith('http')) {
        return user.profilePictureUrl;
      }
      // Garantir que a URL está completa e adicionar timestamp para evitar cache
      const url = user.profilePictureUrl.startsWith('/')
        ? user.profilePictureUrl
        : `/${user.profilePictureUrl}`;
      // Adicionar timestamp para forçar reload da imagem após upload
      const separator = url.includes('?') ? '&' : '?';
      return `http://localhost:8080${url}${separator}t=${Date.now()}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg zen-shadow-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold zen-gradient-text">Meu Perfil</h1>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Voltar ao Dashboard
              </button>
            </div>
          </div>

          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {getProfilePictureUrl() && !imageError ? (
                  <div className="relative">
                    <img
                      key={user?.profilePictureUrl || 'avatar'}
                      src={getProfilePictureUrl()!}
                      alt="Foto de perfil"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={() => {
                        console.error('Erro ao carregar imagem:', getProfilePictureUrl());
                        setImageError(true);
                      }}
                      onLoad={() => {
                        console.log('Imagem carregada com sucesso:', getProfilePictureUrl());
                        setImageError(false);
                      }}
                    />
                    {isUploadingPhoto && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-white shadow-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="mt-2 text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  {isUploadingPhoto ? 'Enviando...' : 'Alterar foto'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="px-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Informações Pessoais
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'password'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Alterar Senha
              </button>
              <button
                onClick={() => setActiveTab('danger')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'danger'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Zona de Perigo
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-lg zen-shadow-lg">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="schoolGrade" className="block text-sm font-medium text-gray-700 mb-2">
                    Série/Ano
                  </label>
                  <Dropdown
                    value={profileData.schoolGrade || ''}
                    options={schoolGrades}
                    onChange={(e) => setProfileData(prev => ({ ...prev, schoolGrade: e.value }))}
                    className="w-full custom-dropdown"
                    placeholder="Selecione sua série"
                    showClear={false}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="studyGoals" className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivos de Estudo
                </label>
                <textarea
                  id="studyGoals"
                  name="studyGoals"
                  value={profileData.studyGoals}
                  onChange={handleProfileChange}
                  rows={4}
                  placeholder="Ex: Passar no ENEM, melhorar redação..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
                <p className="text-gray-500 text-xs mt-1">
                  {profileData.studyGoals?.length || 0}/500 caracteres
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
              <div className="max-w-md space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Senha Atual *
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Nova Senha *
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-gray-500 text-xs mt-1">Mínimo 6 caracteres</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nova Senha *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  {isLoading ? 'Alterando...' : 'Alterar Senha'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'danger' && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-red-900 mb-2">Deletar Conta</h3>
                <p className="text-red-700 mb-4">
                  Esta ação é irreversível. Todos os seus dados, incluindo redações e feedbacks, serão permanentemente deletados.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Deletar Minha Conta
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-red-800 font-medium">
                      Tem certeza? Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        {isLoading ? 'Deletando...' : 'Sim, Deletar Conta'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
