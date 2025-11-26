import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EssayService } from '@/services/essayService';
import { useEssayStore } from '@/store/essayStore';
import { Essay } from '@/types';
import { showToast } from '@/utils/toast';

const essaySchema = z.object({
  title: z.string()
    .min(5, 'Título deve ter pelo menos 5 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  theme: z.string()
    .min(10, 'Tema deve ter pelo menos 10 caracteres')
    .max(500, 'Tema deve ter no máximo 500 caracteres'),
  content: z.string()
    .min(150, 'Redação deve ter pelo menos 150 palavras')
    .max(5000, 'Redação deve ter no máximo 5000 palavras')
});

type EssayFormData = z.infer<typeof essaySchema>;

interface EssayEditorProps {
  essay?: Essay;
  onSave?: (essay: Essay) => void;
  onCancel?: () => void;
}

const EssayEditor: React.FC<EssayEditorProps> = ({ essay, onSave, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const { addEssay, updateEssay } = useEssayStore();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty }
  } = useForm<EssayFormData>({
    resolver: zodResolver(essaySchema),
    defaultValues: {
      title: essay?.title || '',
      theme: essay?.theme || '',
      content: essay?.content || ''
    }
  });

  const content = watch('content');

  useEffect(() => {
    if (content) {
      const words = content.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    } else {
      setWordCount(0);
    }
  }, [content]);

  const onSubmit = async (data: EssayFormData) => {
    setIsLoading(true);

    try {
      let savedEssay: Essay;

      if (essay?.id) {
        savedEssay = await EssayService.updateEssay(essay.id, data);
        updateEssay(savedEssay);
        showToast.success('Redação atualizada com sucesso!');
      } else {
        savedEssay = await EssayService.createEssay(data);
        addEssay(savedEssay);
        showToast.success('Redação criada com sucesso!');
      }

      onSave?.(savedEssay);
    } catch (error) {
      console.error('Error saving essay:', error);
      showToast.error('Erro ao salvar redação. Tente novamente.', 'Erro ao Salvar');
    } finally {
      setIsLoading(false);
    }
  };

  const getWordCountColor = () => {
    if (wordCount < 150) return 'text-red-500';
    if (wordCount > 800) return 'text-primary-500';
    return 'text-green-500';
  };

  const cardHeader = (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold text-white">
        {essay ? 'Editar Redação' : 'Nova Redação'}
      </h2>
      <Badge
        value={`${wordCount} palavras`}
        className={`${getWordCountColor()} bg-white bg-opacity-20`}
      />
    </div>
  );

  return (
    <Card header={cardHeader} className="w-full zen-shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="field">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Título da Redação *
          </label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <InputText
                {...field}
                id="title"
                placeholder="Digite o título da sua redação"
                className={`w-full ${errors.title ? 'p-invalid' : ''}`}
                disabled={isLoading}
              />
            )}
          />
          {errors.title && (
            <small className="p-error block mt-1">
              {errors.title.message}
            </small>
          )}
        </div>

        <div className="field">
          <label htmlFor="theme" className="block text-sm font-medium mb-2">
            Tema da Redação *
          </label>
          <Controller
            name="theme"
            control={control}
            render={({ field }) => (
              <InputTextarea
                {...field}
                id="theme"
                placeholder="Descreva o tema ou proposta da redação (ex: A importância da educação digital no Brasil)"
                rows={3}
                className={`w-full ${errors.theme ? 'p-invalid' : ''}`}
                disabled={isLoading}
              />
            )}
          />
          {errors.theme && (
            <small className="p-error block mt-1">
              {errors.theme.message}
            </small>
          )}
        </div>

        <div className="field">
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Conteúdo da Redação *
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <InputTextarea
                {...field}
                id="content"
                placeholder="Escreva sua redação aqui... Lembre-se da estrutura: introdução, desenvolvimento (2-3 parágrafos) e conclusão com proposta de intervenção."
                rows={20}
                className={`w-full ${errors.content ? 'p-invalid' : ''}`}
                disabled={isLoading}
              />
            )}
          />
          {errors.content && (
            <small className="p-error block mt-1">
              {errors.content.message}
            </small>
          )}

          <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
            <span>Recomendado: 150-800 palavras</span>
            <span className={getWordCountColor()}>
              {wordCount} palavras
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            label={essay ? 'Atualizar' : 'Salvar'}
            icon="pi pi-save"
            disabled={isLoading || !isDirty}
            className="zen-gradient border-0"
          />

          {isLoading && (
            <ProgressSpinner
              style={{ width: '30px', height: '30px' }}
              strokeWidth="4"
            />
          )}

          {onCancel && (
            <Button
              type="button"
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-outlined"
              onClick={onCancel}
              disabled={isLoading}
            />
          )}
        </div>
      </form>
    </Card>
  );
};

export default EssayEditor;

