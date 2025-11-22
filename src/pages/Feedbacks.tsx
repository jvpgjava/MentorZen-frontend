import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Skeleton } from 'primereact/skeleton';
import { Essay, EssayStatus, Feedback, FeedbackType } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

const Feedbacks: React.FC = () => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mockFeedbacks: (Feedback & { essayTitle: string })[] = [
    {
      id: '1',
      essayId: '1',
      essayTitle: 'A importância da educação no Brasil',
      type: FeedbackType.AI_GENERATED,
      overallScore: 850,
      competencyScores: {
        competency1: 180,
        competency2: 160,
        competency3: 170,
        competency4: 180,
        competency5: 160
      },
      generalFeedback: 'Excelente redação! Você demonstrou domínio da norma culta e apresentou uma tese clara e bem fundamentada.',
      detailedFeedback: {
        strengths: [
          'Excelente domínio da norma padrão da língua portuguesa',
          'Tese clara e bem posicionada na introdução',
          'Argumentos consistentes e bem desenvolvidos',
          'Boa articulação entre os parágrafos'
        ],
        improvements: [
          'Poderia explorar mais dados estatísticos para fortalecer a argumentação',
          'A conclusão poderia apresentar uma proposta de intervenção mais detalhada'
        ],
        suggestions: [
          'Inclua citações de especialistas na área educacional',
          'Desenvolva melhor a proposta de solução na conclusão'
        ]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      essayId: '2',
      essayTitle: 'Desafios da mobilidade urbana',
      type: FeedbackType.AI_GENERATED,
      overallScore: 720,
      competencyScores: {
        competency1: 140,
        competency2: 150,
        competency3: 130,
        competency4: 160,
        competency5: 140
      },
      generalFeedback: 'Boa redação com argumentos válidos, mas pode melhorar na articulação e no desenvolvimento de algumas ideias.',
      detailedFeedback: {
        strengths: [
          'Tema bem compreendido e desenvolvido',
          'Boa estrutura dissertativa',
          'Argumentos pertinentes ao tema'
        ],
        improvements: [
          'Melhorar a articulação entre parágrafos',
          'Desenvolver melhor alguns argumentos',
          'Atenção a alguns desvios gramaticais'
        ],
        suggestions: [
          'Use mais conectivos para melhorar a coesão',
          'Revise a concordância verbal em alguns trechos'
        ]
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'success';
    if (score >= 600) return 'warning';
    if (score >= 400) return 'info';
    return 'danger';
  };

  const getScoreBadge = (score: number) => {
    return (
      <Badge
        value={score}
        severity={getScoreColor(score)}
        className="text-sm font-medium"
      />
    );
  };

  const getFeedbackTypeTag = (type: FeedbackType) => {
    switch (type) {
      case FeedbackType.AI_GENERATED:
        return <Tag value="IA Zen" severity="info" className="bg-blue-100 text-blue-700" icon="pi pi-android" />;
      case FeedbackType.HUMAN_REVIEW:
        return <Tag value="Humano" severity="success" className="bg-green-100 text-green-700" icon="pi pi-user" />;
      case FeedbackType.PEER_REVIEW:
        return <Tag value="Pares" severity="warning" className="bg-yellow-100 text-yellow-700" icon="pi pi-users" />;
      default:
        return <Tag value="Desconhecido" severity="secondary" />;
    }
  };

  const typeOptions = [
    { label: 'Todos os tipos', value: null },
    { label: 'IA Zen', value: FeedbackType.AI_GENERATED },
    { label: 'Revisão Humana', value: FeedbackType.HUMAN_REVIEW },
    { label: 'Revisão de Pares', value: FeedbackType.PEER_REVIEW },
  ];

  const filteredFeedbacks = mockFeedbacks.filter(feedback => {
    const matchesFilter = globalFilter
      ? feedback.essayTitle.toLowerCase().includes(globalFilter.toLowerCase()) ||
      feedback.generalFeedback.toLowerCase().includes(globalFilter.toLowerCase())
      : true;
    const matchesType = selectedType ? feedback.type === selectedType : true;
    return matchesFilter && matchesType;
  });

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <span className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar feedback..."
          className="w-full"
        />
      </span>
      <Dropdown
        value={selectedType}
        options={typeOptions}
        onChange={(e) => setSelectedType(e.value)}
        placeholder="Filtrar por tipo"
        className="w-full md:w-auto"
      />
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton height="3rem" className="mb-4" />
        <Skeleton height="20rem" />
      </div>
    );
  }

  return (
    <div className="p-fluid">
      <Card className="shadow-lg border-0">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <i className="pi pi-comments text-orange-500"></i>
            Meus Feedbacks
          </h2>

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
                style={{ minWidth: '200px', textAlign: 'center' }}
                headerStyle={{ textAlign: 'center' }}
                body={(feedback) => (
                  <div className="font-medium text-gray-900">{feedback.essayTitle}</div>
                )}
              />
              <Column
                field="type"
                header="Tipo"
                sortable
                style={{ minWidth: '120px', textAlign: 'center' }}
                headerStyle={{ textAlign: 'center' }}
                body={(feedback) => getFeedbackTypeBadge(feedback.type)}
              />
              <Column
                field="overallScore"
                header="Nota"
                sortable
                style={{ minWidth: '100px', textAlign: 'center' }}
                headerStyle={{ textAlign: 'center' }}
                body={(feedback) => getScoreBadge(feedback.overallScore)}
              />
              <Column
                field="generalComment"
                header="Comentário Geral"
                style={{ minWidth: '250px', textAlign: 'center' }}
                headerStyle={{ textAlign: 'center' }}
                body={(feedback) => (
                  <div className="text-sm text-gray-700 truncate max-w-xs mx-auto">
                    {feedback.generalComment}
                  </div>
                )}
              />
              <Column
                field="createdAt"
                header="Data"
                sortable
                style={{ minWidth: '120px', textAlign: 'center' }}
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
              <i className="pi pi-comment text-4xl mb-4"></i>
              <p className="text-lg">Nenhum feedback encontrado.</p>
              <p className="text-sm mt-2">Envie suas redações para análise e receba feedbacks personalizados!</p>
              <Button
                label="Nova Redação"
                icon="pi pi-plus"
                className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white font-medium px-6 py-3 text-lg rounded-lg"
                onClick={() => navigate('/essays/new')}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Feedbacks;
