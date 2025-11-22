import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
import { EssayService } from '@/services/essayService';
import { Essay, EssayStatus } from '@/types';
import { showToast } from '@/utils/toast';

const AllEssays: React.FC = () => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<EssayStatus | null>(null);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEssays();
  }, []);

  const loadEssays = async () => {
    try {
      setIsLoading(true);
      const response = await EssayService.getUserEssays(0, 1000);
      const allEssays = response.content || [];
      setEssays(allEssays);
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao carregar redações. Tente novamente.', 'Erro ao Carregar');
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { label: 'Todos os Status', value: null },
    { label: 'Rascunho', value: EssayStatus.DRAFT },
    { label: 'Enviada', value: EssayStatus.SUBMITTED },
    { label: 'Analisada', value: EssayStatus.ANALYZED },
    { label: 'Arquivada', value: EssayStatus.ARCHIVED },
  ];

  const filteredEssays = essays.filter(essay => {
    const matchesStatus = !statusFilter || essay.status === statusFilter;
    const matchesSearch = !globalFilter ||
      essay.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
      essay.theme.toLowerCase().includes(globalFilter.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: EssayStatus) => {
    const statusConfig = {
      [EssayStatus.DRAFT]: { label: 'Rascunho', className: 'bg-blue-100 text-blue-700', icon: 'pi-file-edit' },
      [EssayStatus.SUBMITTED]: { label: 'Enviada', className: 'bg-yellow-100 text-yellow-700', icon: 'pi-clock' },
      [EssayStatus.ANALYZED]: { label: 'Analisada', className: 'bg-green-100 text-green-700', icon: 'pi-check-circle' },
      [EssayStatus.ARCHIVED]: { label: 'Arquivada', className: 'bg-gray-100 text-gray-700', icon: 'pi-archive' },
    };

    const config = statusConfig[status];
    return (
      <div className="flex items-center justify-center">
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
          <i className={`pi ${config.icon} text-xs`}></i>
          {config.label}
        </span>
      </div>
    );
  };

  const actionBodyTemplate = (essay: any) => {
    return (
      <div className="flex items-center justify-center gap-3">
        <i
          className="pi pi-eye text-orange-500 text-xl cursor-pointer hover:text-orange-600 transition-colors"
          title="Visualizar"
          onClick={() => navigate(`/essays/${essay.id}`)}
        />
        <i
          className="pi pi-pencil text-orange-500 text-xl cursor-pointer hover:text-orange-600 transition-colors"
          title="Editar"
          onClick={() => navigate(`/essays/${essay.id}/edit`)}
        />
        {essay.status === EssayStatus.ANALYZED && (
          <i
            className="pi pi-comments text-orange-500 text-xl cursor-pointer hover:text-orange-600 transition-colors"
            title="Ver Feedback"
            onClick={() => navigate(`/essays/${essay.id}/feedback`)}
          />
        )}
      </div>
    );
  };

  const dateBodyTemplate = (essay: any) => {
    return (
      <div className="text-center">
        <span className="text-sm text-gray-600">
          {new Date(essay.createdAt).toLocaleDateString('pt-BR')}
        </span>
      </div>
    );
  };

  const wordCountBodyTemplate = (essay: any) => {
    return (
      <div className="text-center">
        <Badge
          value={essay.wordCount}
          className="bg-gray-100 text-gray-700 font-medium"
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-200 animate-pulse rounded-2xl h-24"></div>
        <div className="bg-gray-200 animate-pulse rounded-xl h-96"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center">
            <img 
              src="/essay-icons/TodasRedacoesIcon.png" 
              alt="Todas Redações" 
              className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-orange-600 mb-2">Minhas Redações</h1>
            <p className="text-orange-500 text-lg font-medium">
              Gerencie todas as suas redações em um só lugar
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
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="flex-1">
                <span className="p-input-icon-left w-full">
                  <i className="pi pi-search text-gray-400" />
                  <InputText
                    placeholder="Buscar por título ou tema..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full h-12 text-lg border-2 border-gray-200 focus:border-orange-500 rounded-lg"
                  />
                </span>
              </div>
              <div className="w-full md:w-64">
                <Dropdown
                  value={statusFilter}
                  options={statusOptions}
                  onChange={(e) => setStatusFilter(e.value)}
                  placeholder="Filtrar por status"
                  className="w-full h-12 text-lg border-2 border-gray-200 focus:border-orange-500 rounded-lg"
                  panelClassName="text-lg"
                />
              </div>
            </div>
            <div className="text-lg text-gray-600 font-medium">
              {filteredEssays.length} de {essays.length} redações
            </div>
          </div>
        </div>
      </Card>

      <Card className="shadow-lg border-0">
        <div className="p-0">
          <DataTable
            value={filteredEssays}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            responsiveLayout="scroll"
            emptyMessage="Nenhuma redação encontrada"
            className="custom-datatable"
            sortField="createdAt"
            sortOrder={-1}
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
              field="status"
              header="Status"
              sortable
              style={{ minWidth: '140px', textAlign: 'center' }}
              headerStyle={{ textAlign: 'center' }}
              body={(essay) => getStatusBadge(essay.status)}
            />
            <Column
              field="wordCount"
              header="Palavras"
              sortable
              style={{ minWidth: '120px', textAlign: 'center' }}
              headerStyle={{ textAlign: 'center' }}
              body={wordCountBodyTemplate}
            />
            <Column
              field="createdAt"
              header="Data de Criação"
              sortable
              style={{ minWidth: '140px', textAlign: 'center' }}
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
        </div>
      </Card>

    </div>
  );
};

export default AllEssays;
