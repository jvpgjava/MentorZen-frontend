import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { useNavigate } from 'react-router-dom';
import { useEssayStore } from '@/store/essayStore';
import { EssayService } from '@/services/essayService';
import { EssayCreateRequest } from '@/types';
import { showToast } from '@/utils/toast';

const NewEssay: React.FC = () => {
  const navigate = useNavigate();
  const { addEssay } = useEssayStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<EssayCreateRequest>>({
    title: '',
    theme: '',
    content: '',
    essayType: 'ARGUMENTATIVE'
  });

  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [customTheme, setCustomTheme] = useState<string>('');
  const [wordCount, setWordCount] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const essayTypes = [
    { label: 'Dissertativo-Argumentativo', value: 'ARGUMENTATIVE' },
    { label: 'Narrativo', value: 'NARRATIVE' },
    { label: 'Descritivo', value: 'DESCRIPTIVE' },
  ];

  const themes = [
    { label: 'Escolha um tema...', value: '' },
    { label: 'Sustentabilidade e Meio Ambiente', value: 'Sustentabilidade e Meio Ambiente' },
    { label: 'Tecnologia e Sociedade', value: 'Tecnologia e Sociedade' },
    { label: 'Educação no Brasil', value: 'Educação no Brasil' },
    { label: 'Desigualdade Social', value: 'Desigualdade Social' },
    { label: 'Saúde Mental na Juventude', value: 'Saúde Mental na Juventude' },
    { label: 'Democracia e Cidadania', value: 'Democracia e Cidadania' },
    { label: 'Diversidade e Inclusão', value: 'Diversidade e Inclusão' },
    { label: 'Tema Personalizado', value: 'custom' },
  ];

  const updateWordCount = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setFormData({ ...formData, content });
    updateWordCount(content);

    if (errors.content) {
      setErrors({ ...errors, content: '' });
    }
  };

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
    if (value === 'custom') {
      setFormData({ ...formData, theme: customTheme });
    } else {
      setFormData({ ...formData, theme: value });
      setCustomTheme('');
    }
    if (errors.theme) {
      setErrors({ ...errors, theme: '' });
    }
  };

  const handleCustomThemeChange = (value: string) => {
    setCustomTheme(value);
    setFormData({ ...formData, theme: value });
    if (errors.theme) {
      setErrors({ ...errors, theme: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (selectedTheme === 'custom' && !customTheme?.trim()) {
      newErrors.theme = 'Tema personalizado é obrigatório';
    } else if (!selectedTheme || (selectedTheme !== 'custom' && !formData.theme?.trim())) {
      newErrors.theme = 'Tema é obrigatório';
    }

    if (!formData.content?.trim()) {
      newErrors.content = 'Conteúdo é obrigatório';
    } else if (wordCount < 10) {
      newErrors.content = 'A redação deve ter pelo menos 10 palavras';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canSaveDraft = () => {
    return formData.title?.trim() && wordCount >= 1;
  };

  const handleSaveDraft = async () => {
    if (!formData.title?.trim()) {
      setErrors({ title: 'Título é obrigatório para salvar rascunho' });
      return;
    }

    if (wordCount < 1) {
      setErrors({ content: 'Escreva pelo menos 1 palavra para salvar rascunho' });
      return;
    }

    try {
      setIsLoading(true);
      const essayData: EssayCreateRequest = {
        title: formData.title,
        theme: formData.theme || 'Sem tema definido',
        content: formData.content || '',
        essayType: formData.essayType || 'ARGUMENTATIVE'
      };

      const essay = await EssayService.createEssay(essayData);
      addEssay(essay);
      showToast.success('Rascunho salvo com sucesso');
      navigate('/essays/drafts');
    } catch (error: any) {
      showToast.error('Erro ao salvar rascunho: ' + (error.message || 'Erro desconhecido'), 'Erro ao Salvar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const essayData: EssayCreateRequest = {
        title: formData.title!,
        theme: formData.theme!,
        content: formData.content!,
        essayType: formData.essayType || 'ARGUMENTATIVE'
      };

      const essay = await EssayService.createEssay(essayData);
      addEssay(essay);

      // Envia para análise
      await EssayService.submitForAnalysis(essay.id);
      showToast.success('Redação enviada para análise. Aguarde enquanto nossa IA analisa sua redação...', 'Redação Enviada');
      navigate(`/essays/${essay.id}/feedback`);
    } catch (error: any) {
      showToast.error('Erro ao enviar redação: ' + (error.message || 'Erro desconhecido'), 'Erro ao Enviar');
    } finally {
      setIsLoading(false);
    }
  };

  const getWordCountColor = () => {
    if (wordCount < 150) return 'text-red-500';
    if (wordCount < 250) return 'text-yellow-500';
    if (wordCount <= 400) return 'text-green-500';
    return 'text-orange-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center justify-center">
          <img
            src="/essay-icons/TodasRedacoesIcon.png"
            alt="Nova Redação"
            className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold zen-gradient-text mb-2">Nova Redação</h1>
          <p className="text-gray-600 text-lg">
            Crie sua redação e receba feedback personalizado do Zen
          </p>
        </div>
      </div>

      <Card className="shadow-lg border-0">
        <div className="p-6 space-y-6">
          <div className="px-2">
            <label className="block text-base font-medium text-gray-700 mb-3">
              Título da Redação *
            </label>
            <InputText
              value={formData.title || ''}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              placeholder="Ex: A importância da educação digital"
              className={`w-full h-12 text-base border-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${errors.title ? 'p-invalid' : ''}`}
            />
            {errors.title && (
              <small className="text-red-500 mt-2 block text-sm">{errors.title}</small>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Tipo de Redação
              </label>
              <Dropdown
                value={formData.essayType}
                options={essayTypes}
                onChange={(e) => setFormData({ ...formData, essayType: e.value })}
                className="w-full custom-dropdown"
              />
            </div>

            <div className={selectedTheme === 'custom' ? 'md:col-span-1' : ''}>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Tema *
              </label>
              <Dropdown
                value={selectedTheme}
                options={themes}
                onChange={(e) => handleThemeChange(e.value)}
                className={`w-full custom-dropdown ${errors.theme ? 'p-invalid' : ''}`}
              />
              {errors.theme && (
                <small className="text-red-500 mt-2 block text-sm">{errors.theme}</small>
              )}
            </div>

            {selectedTheme === 'custom' && (
              <div className="md:col-span-1">
                <label className="block text-base font-medium text-gray-700 mb-3">
                  Digite o Tema Personalizado *
                </label>
                <InputText
                  value={customTheme}
                  onChange={(e) => handleCustomThemeChange(e.target.value)}
                  placeholder="Ex: A importância da inteligência artificial na educação"
                  className={`w-full h-12 text-base border-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${errors.theme ? 'p-invalid' : ''}`}
                />
                {errors.theme && selectedTheme === 'custom' && (
                  <small className="text-red-500 mt-2 block text-sm">{errors.theme}</small>
                )}
              </div>
            )}
          </div>

          <div className="px-2">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-base font-medium text-gray-700">
                Conteúdo da Redação *
              </label>
              <span className={`text-base font-medium ${getWordCountColor()}`}>
                {wordCount} palavras
              </span>
            </div>
            <InputTextarea
              value={formData.content || ''}
              onChange={handleContentChange}
              placeholder="Escreva sua redação aqui..."
              rows={15}
              className={`w-full text-base border-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${errors.content ? 'p-invalid' : ''}`}
              style={{ minHeight: '300px' }}
            />
            {errors.content && (
              <small className="text-red-500 mt-2 block text-sm">{errors.content}</small>
            )}

            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Muito pouco</span>
                <span>Ideal (150-400)</span>
                <span>Muito longo</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${wordCount < 150 ? 'bg-red-400' :
                    wordCount <= 400 ? 'bg-green-400' : 'bg-orange-400'
                    }`}
                  style={{ width: `${Math.min((wordCount / 400) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button
              label="Salvar Rascunho"
              icon="pi pi-save"
              className={`flex-1 border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-medium px-6 py-3 text-lg rounded-lg ${canSaveDraft()
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white !text-white'
                : 'bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed'
                }`}
              onClick={handleSaveDraft}
              disabled={isLoading || !canSaveDraft()}
            />
            <Button
              label="Enviar para Análise"
              icon="pi pi-send"
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white font-medium px-6 py-3 text-lg rounded-lg"
              onClick={handleSubmit}
              disabled={isLoading || wordCount < 10}
              loading={isLoading}
            />
          </div>

          {wordCount < 10 && formData.content && (
            <Message
              severity="warn"
              text="Escreva pelo menos 10 palavras para enviar para análise"
              className="w-full mt-4"
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default NewEssay;
