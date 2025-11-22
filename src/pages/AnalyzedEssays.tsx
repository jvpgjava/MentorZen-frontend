import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { useEssayStore } from '@/store/essayStore';
import { Essay, EssayStatus } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AnalyzedEssays: React.FC = () => {
  const navigate = useNavigate();
  const { essays } = useEssayStore();
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const analyzedEssays = essays.filter(essay => essay.status === EssayStatus.ANALYZED);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const getStatusTag = (status: EssayStatus) => {
    switch (status) {
      case EssayStatus.ANALYZED:
        return <Tag value="Analisada" severity="success" className="bg-green-100 text-green-700" />;
      default:
        return <Tag value="Desconhecido" severity="contrast" />;
    }
  };

  const getScoreBadge = (score?: number) => {
    if (!score) return <Badge value="N/A" severity="secondary" />;

    let severity: "success" | "warning" | "info" | "danger" = "info";
    if (score >= 800) severity = "success";
    else if (score >= 600) severity = "warning";
    else if (score >= 400) severity = "info";
    else severity = "danger";

    return <Badge value={score} severity={severity} className="text-sm font-medium" />;
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
      <Button
        label="Nova Redação"
        icon="pi pi-plus"
        className="p-button-primary gradient-button w-full md:w-auto"
        onClick={() => navigate('/essays/new')}
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
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center">
            <i className="pi pi-check-circle text-green-600 text-4xl"></i>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-green-600 mb-2">Redações Analisadas</h1>
            <p className="text-green-500 text-lg font-medium">
              Visualize suas redações já corrigidas e seus feedbacks
            </p>
          </div>
        </div>
        <Button
          label="Nova Redação"
          icon="pi pi-plus"
          className="bg-gradient-to-r from-orange-500 to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white font-medium px-6 py-3 text-lg rounded-lg"
          onClick={() => navigate('/essays/new')}
        />
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
                body={(essay) => getScoreBadge((essay as any).score)} // Mock score
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
              <i className="pi pi-check-circle text-4xl mb-4"></i>
              <p className="text-lg">Nenhuma redação analisada ainda.</p>
              <p className="text-sm mt-2">Envie suas redações para análise usando o botão "Nova Redação" no topo da página!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AnalyzedEssays;
