import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Skeleton } from 'primereact/skeleton';
import { Feedback, FeedbackType } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { showToast } from '@/utils/toast';
import { FeedbackService } from '@/services/feedbackService';
import { EssayService } from '@/services/essayService';
import Loading from '@/components/Loading';

interface FeedbackWithEssayTitle extends Feedback {
  essayTitle?: string;
}

const Feedbacks: React.FC = () => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackWithEssayTitle[]>([]);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setIsLoading(true);
      const feedbacksData = await FeedbackService.getUserFeedbacks();

      const feedbacksWithTitles = await Promise.all(
        feedbacksData.map(async (feedback) => {
          if (feedback.essayId) {
            try {
              const essay = await EssayService.getEssay(feedback.essayId);
              return { ...feedback, essayTitle: essay.title };
            } catch (error) {
              return { ...feedback, essayTitle: 'Redação não encontrada' };
            }
          }
          return { ...feedback, essayTitle: 'Sem redação associada' };
        })
      );

      setFeedbacks(feedbacksWithTitles);
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao carregar feedbacks. Tente novamente.', 'Erro ao Carregar');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600';
    if (score >= 600) return 'text-primary-600';
    if (score >= 400) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFeedbackTypeText = (type: FeedbackType) => {
    switch (type) {
      case FeedbackType.AI_GENERATED:
        return 'IA Zen';
      case FeedbackType.HUMAN_REVIEW:
        return 'Humano';
      case FeedbackType.PEER_REVIEW:
        return 'Pares';
      default:
        return 'Desconhecido';
    }
  };

  const getFeedbackTypeColor = (type: FeedbackType) => {
    switch (type) {
      case FeedbackType.AI_GENERATED:
        return 'text-blue-600';
      case FeedbackType.HUMAN_REVIEW:
        return 'text-green-600';
      case FeedbackType.PEER_REVIEW:
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const typeOptions = [
    { label: 'Todos os tipos', value: null },
    { label: 'IA Zen', value: FeedbackType.AI_GENERATED },
    { label: 'Revisão Humana', value: FeedbackType.HUMAN_REVIEW },
    { label: 'Revisão de Pares', value: FeedbackType.PEER_REVIEW },
  ];

  const dateBodyTemplate = (feedback: FeedbackWithEssayTitle) => {
    return (
      <div>
        <div className="font-medium text-gray-700">
          {format(new Date(feedback.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
        </div>
        <div className="text-sm text-gray-500">
          {format(new Date(feedback.createdAt), 'HH:mm', { locale: ptBR })}
        </div>
      </div>
    );
  };

  const actionBodyTemplate = (feedback: FeedbackWithEssayTitle) => {
    return (
      <div className="flex gap-3 justify-center">
        <i
          className="pi pi-eye text-xl text-[#162A41] hover:text-[#162A41] hover:opacity-80 cursor-pointer transition-colors"
          onClick={() => navigate(`/essays/${feedback.essayId}/feedback`)}
          title="Visualizar"
        ></i>
      </div>
    );
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesFilter = globalFilter
      ? (feedback.essayTitle?.toLowerCase().includes(globalFilter.toLowerCase()) || false) ||
      feedback.generalComment.toLowerCase().includes(globalFilter.toLowerCase())
      : true;
    const matchesType = selectedType ? feedback.type === selectedType : true;
    return matchesFilter && matchesType;
  });

  const header = (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <span className="p-input-icon-left w-full">
          <i className="pi pi-search text-gray-400" />
          <InputText
            type="search"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar feedback..."
            className="w-full h-12 text-base border-2 border-gray-200 focus:border-primary-500 rounded-lg"
          />
        </span>
      </div>
      <div className="w-full md:w-48">
        <Dropdown
          value={selectedType}
          options={typeOptions}
          onChange={(e) => setSelectedType(e.value)}
          placeholder="Filtrar por tipo"
          className="w-full h-12 text-base border-2 border-gray-200 focus:border-primary-500 rounded-lg custom-dropdown"
          panelClassName="text-base"
        />
      </div>
    </div>
  );

  if (isLoading || !showContent) {
    return <Loading onComplete={() => setShowContent(true)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center justify-center">
          <img
            src="/essay-icons/RedacoesAnalisadasIcon.png"
            alt="Feedbacks"
            className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-[#162A41] mb-2">Meus Feedbacks</h1>
          <p className="text-gray-600 text-lg">
            Visualize todos os feedbacks das suas redações
          </p>
        </div>
      </div>

      <Card className="shadow-lg border-0 bg-white">
        <div className="p-6">
          {filteredFeedbacks.length > 0 ? (
            <DataTable
              value={filteredFeedbacks}
              header={header}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              responsiveLayout="scroll"
              emptyMessage="Nenhum feedback encontrado."
              className="custom-datatable"
            >
              <Column
                field="essayTitle"
                header="Redação"
                sortable
                style={{ minWidth: '200px' }}
                body={(feedback) => (
                  <div className="font-medium text-gray-900">{feedback.essayTitle}</div>
                )}
              />
              <Column
                field="type"
                header="Tipo"
                sortable
                style={{ minWidth: '120px' }}
                body={(feedback) => (
                  <span className={`font-medium ${getFeedbackTypeColor(feedback.type)}`}>
                    {getFeedbackTypeText(feedback.type)}
                  </span>
                )}
              />
              <Column
                field="overallScore"
                header="Nota"
                sortable
                style={{ minWidth: '100px' }}
                body={(feedback) => (
                  <span className={`font-semibold ${getScoreColor(feedback.overallScore || 0)}`}>
                    {feedback.overallScore || 0}
                  </span>
                )}
              />
              <Column
                field="generalComment"
                header="Comentário Geral"
                style={{ minWidth: '250px' }}
                body={(feedback) => (
                  <div className="text-sm text-gray-700">
                    {feedback.generalComment || 'Sem comentário'}
                  </div>
                )}
              />
              <Column
                field="createdAt"
                header="Data"
                sortable
                style={{ minWidth: '120px' }}
                body={dateBodyTemplate}
              />
              <Column
                header="Ações"
                style={{ minWidth: '100px' }}
                body={actionBodyTemplate}
              />
            </DataTable>
          ) : (
            <div className="text-center py-12">
              <img
                src="/essay-icons/RedacoesAnalisadasIcon.png"
                alt="Nenhum feedback"
                className="w-24 h-24 mx-auto mb-4 opacity-50"
              />
              <p className="text-lg font-normal text-gray-500 opacity-50">Nenhum feedback encontrado.</p>
              <p className="text-sm mt-2 text-gray-400">Envie suas redações para análise e receba feedbacks personalizados!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Feedbacks;
