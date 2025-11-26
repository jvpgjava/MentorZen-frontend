import React, { useState, useEffect, useCallback } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useNavigate } from 'react-router-dom';
import { EssayService } from '@/services/essayService';
import { Essay, EssayStatus } from '@/types';
import { showToast } from '@/utils/toast';
import Loading from '@/components/Loading';

const AllEssays: React.FC = () => {
  const navigate = useNavigate();
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<EssayStatus | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState<-1 | 0 | 1>(-1);
  const [resendingId, setResendingId] = useState<number | null>(null);

  const loadEssays = useCallback(async (page = 0, size = 10, sortBy = 'updatedAt', sortDir = 'desc', status?: EssayStatus | null, keyword?: string, date?: Date | null) => {
    try {
      setIsLoading(true);
      const response = await EssayService.getUserEssays(
        page,
        size,
        sortBy,
        sortDir,
        status || undefined,
        keyword || undefined,
        date || undefined
      );
      setEssays(response.content || []);
      setTotalElements(response.totalElements || 0);
      setCurrentPage(page);
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao carregar redações. Tente novamente.', 'Erro ao Carregar');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEssays(0, pageSize, sortField, sortOrder === -1 ? 'desc' : 'asc', statusFilter, searchFilter, dateFilter);
  }, [statusFilter, dateFilter, pageSize, sortField, sortOrder, loadEssays]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEssays(0, pageSize, sortField, sortOrder === -1 ? 'desc' : 'asc', statusFilter, searchFilter, dateFilter);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchFilter, loadEssays, pageSize, sortField, sortOrder, statusFilter, dateFilter]);

  const statusOptions = [
    { label: 'Todos os Status', value: null },
    { label: 'Rascunho', value: EssayStatus.DRAFT },
    { label: 'Enviada', value: EssayStatus.SUBMITTED },
    { label: 'Analisada', value: EssayStatus.ANALYZED },
    { label: 'Arquivada', value: EssayStatus.ARCHIVED },
  ];

  const handlePageChange = (event: any) => {
    const newPage = event.page;
    const newSize = event.rows;
    setPageSize(newSize);
    loadEssays(newPage, newSize, sortField, sortOrder === -1 ? 'desc' : 'asc', statusFilter, searchFilter, dateFilter);
  };

  const handleSort = (event: any) => {
    const newSortField = event.sortField;
    const newSortOrder = event.sortOrder;
    setSortField(newSortField);
    setSortOrder(newSortOrder);
    loadEssays(currentPage, pageSize, newSortField, newSortOrder === -1 ? 'desc' : 'asc', statusFilter, searchFilter, dateFilter);
  };

  const handleResend = async (essay: Essay) => {
    setResendingId(essay.id);
    try {
      await EssayService.resendForAnalysis(essay.id);
      showToast.success('Redação reenviada para análise com sucesso!', 'Sucesso');
      loadEssays(currentPage, pageSize, sortField, sortOrder === -1 ? 'desc' : 'asc', statusFilter, searchFilter, dateFilter);
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao reenviar redação para análise.', 'Erro');
    } finally {
      setResendingId(null);
    }
  };

  const getStatusText = (status: EssayStatus) => {
    const statusConfig = {
      [EssayStatus.DRAFT]: { label: 'Rascunho', className: 'text-blue-600 font-semibold' },
      [EssayStatus.SUBMITTED]: { label: 'Enviada', className: 'text-yellow-600 font-semibold' },
      [EssayStatus.ANALYZED]: { label: 'Analisada', className: 'text-green-600 font-semibold' },
      [EssayStatus.ARCHIVED]: { label: 'Arquivada', className: 'text-gray-600 font-semibold' },
    };

    const config = statusConfig[status];
    return (
      <span className={config.className}>
        {config.label}
      </span>
    );
  };

  const actionBodyTemplate = (essay: Essay) => {
    const canResend = essay.status === EssayStatus.SUBMITTED || essay.status === EssayStatus.ANALYZED;
    const isResending = resendingId === essay.id;

    return (
      <div className="flex items-center justify-center gap-3">
        <i
          className="pi pi-eye text-[#162A41] text-xl cursor-pointer hover:text-[#162A41] hover:opacity-80 transition-colors"
          title="Visualizar"
          onClick={() => navigate(`/essays/${essay.id}`)}
        />
        <i
          className="pi pi-pencil text-[#162A41] text-xl cursor-pointer hover:text-[#162A41] hover:opacity-80 transition-colors"
          title="Editar"
          onClick={() => navigate(`/essays/${essay.id}/edit`)}
        />
        {essay.status === EssayStatus.ANALYZED && (
          <i
            className="pi pi-comments text-[#162A41] text-xl cursor-pointer hover:text-[#162A41] hover:opacity-80 transition-colors"
            title="Ver Feedback"
            onClick={() => navigate(`/essays/${essay.id}/feedback`)}
          />
        )}
        {canResend && (
          <i
            className={`pi ${isResending ? 'pi-spin pi-spinner' : 'pi-refresh'} text-[#162A41] text-xl cursor-pointer hover:text-[#162A41] hover:opacity-80 transition-colors ${isResending ? 'pointer-events-none opacity-50' : ''}`}
            title={essay.status === EssayStatus.SUBMITTED ? 'Reenviar para Análise' : 'Solicitar Nova Análise'}
            onClick={() => !isResending && handleResend(essay)}
          />
        )}
      </div>
    );
  };


  if (isLoading || !showContent) {
    return <Loading onComplete={() => setShowContent(true)} />;
  }

  return (
    <div className="space-y-3">
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
            <h1 className="text-4xl font-bold text-[#162A41] mb-2">Minhas Redações</h1>
            <p className="text-gray-600 text-lg font-medium">
              Gerencie todas as suas redações em um só lugar
            </p>
          </div>
        </div>
        <Button
          label="Nova Redação"
          icon="pi pi-plus"
          className="bg-[#88a7e8] border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white font-medium px-6 py-3 text-lg rounded-lg"
          onClick={() => navigate('/essays/new')}
        />
      </div>

      <Card className="shadow-lg border-0 bg-white">
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#162A41] mb-1">Filtros e Busca</h2>
            <p className="text-gray-600 text-xs">Encontre suas redações rapidamente</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <span className="p-input-icon-left w-full">
                <i className="pi pi-search"></i>
                <InputText
                  placeholder="Buscar por título ou tema..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full"
                />
              </span>
            </div>
            <div className="md:col-span-3">
              <Dropdown
                value={statusFilter}
                options={statusOptions}
                onChange={(e) => setStatusFilter(e.value)}
                placeholder="Filtrar por status"
                className="w-full"
                panelClassName="shadow-xl border border-gray-200 rounded-lg"
              />
            </div>
            <div className="md:col-span-3">
              <span className="p-input-icon-left w-full">
                <i className="pi pi-calendar"></i>
                <Calendar
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.value as Date | null)}
                  placeholder="Filtrar por data"
                  dateFormat="dd/mm/yy"
                  showIcon={false}
                  className="w-full"
                  inputClassName="w-full"
                  panelClassName="shadow-xl border border-gray-200 rounded-lg"
                />
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="shadow-lg border-0">
        <div className="p-0">
          <DataTable
            value={essays}
            paginator
            rows={pageSize}
            rowsPerPageOptions={[5, 10, 25, 50]}
            totalRecords={totalElements}
            first={currentPage * pageSize}
            onPage={handlePageChange}
            onSort={handleSort}
            sortField={sortField}
            sortOrder={sortOrder}
            responsiveLayout="scroll"
            emptyMessage="Nenhuma redação encontrada"
            className="custom-datatable"
            loading={isLoading}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="{first} a {last} de {totalRecords}"
          >
            <Column
              field="title"
              header="Título"
              sortable
              style={{ minWidth: '250px' }}
              body={(essay) => (
                <div className="py-2">
                  <div className="font-semibold text-gray-900 mb-1 text-base">{essay.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {essay.theme}
                  </div>
                </div>
              )}
            />
            <Column
              field="status"
              header="Status"
              sortable
              style={{ minWidth: '140px', width: '140px' }}
              body={(essay) => (
                <div className="flex items-center justify-center py-2">
                  {getStatusText(essay.status)}
                </div>
              )}
            />
            <Column
              field="wordCount"
              header="Palavras"
              sortable
              style={{ minWidth: '100px', width: '100px' }}
              body={(essay) => (
                <div className="flex items-center justify-center py-2">
                  <span className="text-gray-700 font-semibold">
                    {essay.wordCount || 0}
                  </span>
                </div>
              )}
            />
            <Column
              field="createdAt"
              header="Data de Criação"
              sortable
              style={{ minWidth: '150px', width: '150px' }}
              body={(essay) => (
                <div className="flex items-center justify-center py-2">
                  <span className="text-sm text-gray-600">
                    {new Date(essay.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            />
            <Column
              header="Ações"
              style={{ minWidth: '140px', width: '140px' }}
              body={(essay) => (
                <div className="flex items-center justify-center gap-3 py-2">
                  {actionBodyTemplate(essay)}
                </div>
              )}
            />
          </DataTable>
        </div>
      </Card>

    </div>
  );
};

export default AllEssays;
