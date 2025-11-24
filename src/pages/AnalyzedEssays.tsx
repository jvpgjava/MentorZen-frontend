import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Essay, EssayStatus } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EssayService } from '@/services/essayService';
import { FeedbackService } from '@/services/feedbackService';
import { showToast } from '@/utils/toast';
import Loading from '@/components/Loading';

interface EssayWithScore extends Essay {
  score?: number;
}

const AnalyzedEssays: React.FC = () => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [analyzedEssays, setAnalyzedEssays] = useState<EssayWithScore[]>([]);

  useEffect(() => {
    loadAnalyzedEssays();
  }, []);

  const loadAnalyzedEssays = async () => {
    try {
      setIsLoading(true);
      const essays = await EssayService.getEssaysByStatus(EssayStatus.ANALYZED);

      const essaysWithScores = await Promise.all(
        essays.map(async (essay) => {
          try {
            const feedbacks = await FeedbackService.getEssayFeedbacks(essay.id);
            const latestFeedback = feedbacks[0];
            return {
              ...essay,
              score: latestFeedback?.overallScore
            };
          } catch (error) {
            return { ...essay, score: undefined };
          }
        })
      );

      setAnalyzedEssays(essaysWithScores);
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao carregar redações analisadas. Tente novamente.', 'Erro ao Carregar');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreBadge = (score?: number) => {
    if (!score) return <Badge value="N/A" severity="info" />;

    let severity: "success" | "warning" | "info" | "danger" = "info";
    if (score >= 800) severity = "success";
    else if (score >= 600) severity = "warning";
    else if (score >= 400) severity = "info";
    else severity = "danger";

    return <Badge value={score} severity={severity} className="text-sm font-medium" />;
  };

  const dateBodyTemplate = (essay: EssayWithScore) => {
    return (
      <div className="text-center">
        <div className="font-medium">
          {format(new Date(essay.updatedAt), 'dd/MM/yyyy', { locale: ptBR })}
        </div>
        <div className="text-sm text-gray-500">
          {format(new Date(essay.updatedAt), 'HH:mm', { locale: ptBR })}
        </div>
      </div>
    );
  };

  const wordCountBodyTemplate = (essay: EssayWithScore) => {
    const getWordCountColor = (count: number) => {
      if (count < 150) return 'text-red-500';
      if (count <= 400) return 'text-green-500';
      return 'text-primary-500';
    };

    return (
      <div className="text-center">
        <span className={`font-medium ${getWordCountColor(essay.wordCount || 0)}`}>
          {essay.wordCount || 0}
        </span>
      </div>
    );
  };

  const actionBodyTemplate = (essay: EssayWithScore) => {
    return (
      <div className="flex items-center justify-center gap-3">
        <i
          className="pi pi-eye text-[#162A41] text-xl cursor-pointer hover:text-[#162A41] hover:opacity-80 transition-colors"
          title="Ver Detalhes"
          onClick={() => navigate(`/essays/${essay.id}`)}
        />
        <i
          className="pi pi-comment text-[#162A41] text-xl cursor-pointer hover:text-[#162A41] hover:opacity-80 transition-colors"
          title="Ver Feedback"
          onClick={() => navigate(`/essays/${essay.id}/feedback`)}
        />
      </div>
    );
  };

  const filteredEssays = analyzedEssays.filter(essay => {
    const matchesFilter = globalFilter
      ? essay.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
      essay.theme.toLowerCase().includes(globalFilter.toLowerCase())
      : true;
    return matchesFilter;
  });

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <span className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar redação analisada..."
          className="w-full"
        />
      </span>
    </div>
  );

  if (isLoading || !showContent) {
    return <Loading onComplete={() => setShowContent(true)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center">
            <img 
              src="/essay-icons/RedacoesAnalisadasIcon.png" 
              alt="Redações Analisadas" 
              className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-green-600 mb-2">Redações Analisadas</h1>
            <p className="text-green-500 text-lg font-medium">
              Visualize suas redações já corrigidas e seus feedbacks
            </p>
          </div>
        </div>
      </div>

      <Card className="shadow-lg border-0">
        <div className="p-6">

          {filteredEssays.length > 0 ? (
            <DataTable
              value={filteredEssays}
              header={header}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              responsiveLayout="scroll"
              emptyMessage="Nenhuma redação analisada encontrada."
              className="custom-datatable"
            >
              <Column
                field="title"
                header="Título"
                sortable
                style={{ minWidth: '200px', textAlign: 'center' }}
                headerStyle={{ textAlign: 'center' }}
                body={(essay) => (
                  <div className="text-center">
                    <div className="font-medium text-gray-900 mb-1">{essay.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs mx-auto">
                      {essay.theme}
                    </div>
                  </div>
                )}
              />
              <Column
                field="wordCount"
                header="Palavras"
                sortable
                style={{ textAlign: 'center' }}
                headerStyle={{ textAlign: 'center' }}
                body={wordCountBodyTemplate}
              />
              <Column
                field="score"
                header="Nota"
                sortable
                style={{ textAlign: 'center' }}
                headerStyle={{ textAlign: 'center' }}
                body={(essay) => getScoreBadge(essay.score)}
              />
              <Column
                field="updatedAt"
                header="Data de Análise"
                sortable
                style={{ textAlign: 'center' }}
                headerStyle={{ textAlign: 'center' }}
                body={dateBodyTemplate}
              />
              <Column
                header="Ações"
                style={{ minWidth: '120px', textAlign: 'center' }}
                headerStyle={{ textAlign: 'center' }}
                body={actionBodyTemplate}
              />
            </DataTable>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="flex justify-center mb-4">
                <img 
                  src="/essay-icons/RedacoesAnalisadasIcon.png" 
                  alt="Redações Analisadas" 
                  className="w-24 h-24 lg:w-28 lg:h-28 object-contain opacity-50"
                />
              </div>
              <p className="text-lg">Nenhuma redação analisada ainda.</p>
              <p className="text-sm mt-2">Envie suas redações para análise e receba feedbacks personalizados!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AnalyzedEssays;
