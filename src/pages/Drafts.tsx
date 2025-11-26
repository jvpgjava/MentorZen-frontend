import React, { useState, useEffect, useCallback } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useNavigate } from 'react-router-dom';
import { useEssayStore } from '@/store/essayStore';
import { EssayService } from '@/services/essayService';
import { Essay, EssayStatus } from '@/types';
import { showToast } from '@/utils/toast';
import Loading from '@/components/Loading';

const Drafts: React.FC = () => {
  const navigate = useNavigate();
  const { setEssays, removeEssay } = useEssayStore();
  const [searchFilter, setSearchFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [drafts, setDrafts] = useState<Essay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState<-1 | 0 | 1>(-1);

  const loadDrafts = useCallback(async (page = 0, size = 10, sortBy = 'updatedAt', sortDir = 'desc', keyword?: string, date?: Date | null) => {
    try {
      setIsLoading(true);
      const response = await EssayService.getUserEssays(
        page,
        size,
        sortBy,
        sortDir,
        EssayStatus.DRAFT,
        keyword || undefined,
        date || undefined
      );
      setDrafts(response.content || []);
      setTotalElements(response.totalElements || 0);
      setCurrentPage(page);
      setEssays(response.content || []);
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao carregar rascunhos. Tente novamente.', 'Erro ao Carregar');
    } finally {
      setIsLoading(false);
    }
  }, [setEssays]);

  useEffect(() => {
    loadDrafts(0, pageSize, sortField, sortOrder === -1 ? 'desc' : 'asc', searchFilter, dateFilter);
  }, [dateFilter, pageSize, sortField, sortOrder, loadDrafts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDrafts(0, pageSize, sortField, sortOrder === -1 ? 'desc' : 'asc', searchFilter, dateFilter);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchFilter, loadDrafts, pageSize, sortField, sortOrder, dateFilter]);

  const handlePageChange = (event: any) => {
    const newPage = event.page;
    const newSize = event.rows;
    setPageSize(newSize);
    loadDrafts(newPage, newSize, sortField, sortOrder === -1 ? 'desc' : 'asc', searchFilter, dateFilter);
  };

  const handleSort = (event: any) => {
    const newSortField = event.sortField;
    const newSortOrder = event.sortOrder;
    setSortField(newSortField);
    setSortOrder(newSortOrder);
    loadDrafts(currentPage, pageSize, newSortField, newSortOrder === -1 ? 'desc' : 'asc', searchFilter, dateFilter);
  };

  const actionBodyTemplate = (essay: any) => {
    return (
      <div className="flex items-center justify-center gap-3">
        <i
          className="pi pi-pencil text-[#162A41] text-xl cursor-pointer hover:text-[#162A41] hover:opacity-80 transition-colors"
          title="Continuar Editando"
          onClick={() => navigate(`/essays/${essay.id}/edit`)}
        />
        <i
          className="pi pi-send text-[#162A41] text-xl cursor-pointer hover:text-[#162A41] hover:opacity-80 transition-colors"
          title="Enviar para Análise"
          onClick={() => handleSubmitDraft(essay)}
        />
        <i
          className="pi pi-trash text-[#162A41] text-xl cursor-pointer hover:text-[#162A41] hover:opacity-80 transition-colors"
          title="Excluir Rascunho"
          onClick={() => confirmDelete(essay)}
        />
      </div>
    );
  };

  const getWordCountColor = (count: number) => {
    if (count < 150) return 'text-red-500';
    if (count <= 400) return 'text-green-500';
    return 'text-primary-500';
  };

  const handleSubmitDraft = (essay: any) => {
    if (essay.wordCount < 10) {
      showToast.warn('A redação deve ter pelo menos 10 palavras para ser enviada para análise.', 'Validação');
      return;
    }

    navigate(`/essays/${essay.id}/edit`);
  };

  const confirmDelete = (essay: any) => {
    confirmDialog({
      message: `Tem certeza que deseja excluir o rascunho "${essay.title}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Sim, Excluir',
      rejectLabel: 'Cancelar',
      accept: () => handleDelete(essay.id)
    });
  };

  const handleDelete = async (essayId: number) => {
    try {
      await EssayService.deleteEssay(essayId);
      removeEssay(essayId);
      setDrafts(drafts.filter(d => d.id !== essayId));
      showToast.success('Rascunho excluído com sucesso');
    } catch (error: any) {
      showToast.error('Erro ao excluir rascunho: ' + (error.message || 'Erro desconhecido'), 'Erro ao Excluir');
    }
  };

  if (isLoading || !showContent) {
    return <Loading onComplete={() => setShowContent(true)} />;
  }

  return (
    <div className="space-y-6">
      <ConfirmDialog />

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center">
            <img 
              src="/essay-icons/RascunhosIcon.png" 
              alt="Rascunhos" 
              className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#162A41] mb-2">Meus Rascunhos</h1>
            <p className="text-gray-600 text-lg font-medium">
              Continue trabalhando em suas redações salvas
            </p>
          </div>
        </div>
      </div>

      <Card className="shadow-lg border-0 bg-white">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <span className="p-input-icon-left w-full">
                <i className="pi pi-search text-gray-400" />
                <InputText
                  placeholder="Buscar por título ou tema..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full h-12 text-base border-2 border-gray-200 focus:border-primary-500 rounded-lg"
                />
              </span>
            </div>
            <div className="w-full md:w-48">
              <span className="p-input-icon-left w-full">
                <i className="pi pi-calendar text-gray-400" />
                <Calendar
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.value as Date | null)}
                  placeholder="Filtrar por data"
                  dateFormat="dd/mm/yy"
                  className="w-full h-12 text-base border-2 border-gray-200 focus:border-primary-500 rounded-lg"
                  inputClassName="w-full h-12 text-base pl-10"
                  panelClassName="text-base"
                />
              </span>
            </div>
          </div>
        </div>
      </Card>

      {drafts.length === 0 ? (
        <Card className="shadow-lg border-0">
          <div className="p-12 text-center">
            <div className="flex items-center justify-center mx-auto mb-6">
              <img 
                src="/essay-icons/NaoEncontradoIcon.png" 
                alt="Rascunhos" 
                className="w-24 h-24 lg:w-28 lg:h-28 object-contain opacity-50"
              />
            </div>
            <p className="text-xl font-normal text-gray-900 mb-3 opacity-50">
              Nenhum rascunho encontrado
            </p>
            <p className="text-gray-600 mb-6 max-w-md mx-auto opacity-50">
              Você ainda não tem rascunhos salvos. Comece criando uma nova redação e salve como rascunho.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="shadow-lg border-0">
          <div className="p-0">
            <DataTable
              value={drafts}
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
              emptyMessage="Nenhum rascunho encontrado"
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
                field="wordCount"
                header="Progresso"
                sortable
                style={{ minWidth: '140px', width: '140px' }}
                body={(essay) => (
                  <div className="flex items-center justify-center py-2">
                    <div className="text-center">
                      <span className={`font-semibold ${getWordCountColor(essay.wordCount)}`}>
                        {essay.wordCount || 0} palavras
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1 max-w-24 mx-auto">
                        <div
                          className={`h-1 rounded-full transition-all ${essay.wordCount < 150 ? 'bg-red-400' :
                            essay.wordCount <= 400 ? 'bg-green-400' : 'bg-primary-400'
                            }`}
                          style={{ width: `${Math.min((essay.wordCount / 400) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              />
              <Column
                field="updatedAt"
                header="Última Modificação"
                sortable
                style={{ minWidth: '160px', width: '160px' }}
                body={(essay) => (
                  <div className="flex items-center justify-center py-2">
                    <div className="text-center">
                      <div className="font-medium text-gray-700">
                        {new Date(essay.updatedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(essay.updatedAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
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
      )}

    </div>
  );
};

export default Drafts;
