import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
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
  const [globalFilter, setGlobalFilter] = useState('');
  const [drafts, setDrafts] = useState<Essay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      setIsLoading(true);
      const essays = await EssayService.getEssaysByStatus(EssayStatus.DRAFT);
      setDrafts(essays);
      setEssays(essays);
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao carregar rascunhos. Tente novamente.', 'Erro ao Carregar');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDrafts = drafts.filter(essay => {
    return !globalFilter ||
      essay.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
      essay.theme.toLowerCase().includes(globalFilter.toLowerCase());
  });

  const actionBodyTemplate = (essay: any) => {
    return (
      <div className="flex items-center justify-center gap-3">
        <i
          className="pi pi-pencil text-orange-500 text-xl cursor-pointer hover:text-orange-600 transition-colors"
          title="Continuar Editando"
          onClick={() => navigate(`/essays/${essay.id}/edit`)}
        />
        <i
          className="pi pi-send text-orange-500 text-xl cursor-pointer hover:text-orange-600 transition-colors"
          title="Enviar para Análise"
          onClick={() => handleSubmitDraft(essay)}
        />
        <i
          className="pi pi-trash text-orange-500 text-xl cursor-pointer hover:text-orange-600 transition-colors"
          title="Excluir Rascunho"
          onClick={() => confirmDelete(essay)}
        />
      </div>
    );
  };

  const dateBodyTemplate = (essay: any) => {
    return (
      <div className="text-center">
        <div className="font-medium">
          {new Date(essay.createdAt).toLocaleDateString('pt-BR')}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(essay.createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    );
  };

  const wordCountBodyTemplate = (essay: any) => {
    const getWordCountColor = (count: number) => {
      if (count < 150) return 'text-red-500';
      if (count <= 400) return 'text-green-500';
      return 'text-orange-500';
    };

    return (
      <div className="text-center">
        <span className={`font-medium ${getWordCountColor(essay.wordCount)}`}>
          {essay.wordCount} palavras
        </span>
      </div>
    );
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
            <h1 className="text-4xl font-bold text-blue-600 mb-2">Meus Rascunhos</h1>
            <p className="text-blue-500 text-lg font-medium">
              Continue trabalhando em suas redações salvas ({drafts.length} rascunhos)
            </p>
          </div>
        </div>
      </div>

      {drafts.length > 0 && (
        <Card className="shadow-lg border-0">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1">
                <span className="p-input-icon-left w-full">
                  <i className="pi pi-search" />
                  <InputText
                    placeholder="Buscar rascunhos por título ou tema..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full"
                  />
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {filteredDrafts.length} de {drafts.length} rascunhos
              </div>
            </div>
          </div>
        </Card>
      )}

      {drafts.length === 0 ? (
        <Card className="shadow-lg border-0">
          <div className="p-12 text-center">
            <div className="flex items-center justify-center mx-auto mb-6">
              <img 
                src="/essay-icons/RascunhosIcon.png" 
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
              value={filteredDrafts}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              responsiveLayout="scroll"
              emptyMessage="Nenhum rascunho encontrado"
              className="custom-datatable"
              sortField="updatedAt"
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
                field="wordCount"
                header="Progresso"
                sortable
                style={{ minWidth: '140px', textAlign: 'center' }}
                headerStyle={{ textAlign: 'center' }}
                body={(essay) => (
                  <div className="text-center">
                    {wordCountBodyTemplate(essay)}
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1 max-w-24 mx-auto">
                      <div
                        className={`h-1 rounded-full transition-all ${essay.wordCount < 150 ? 'bg-red-400' :
                          essay.wordCount <= 400 ? 'bg-green-400' : 'bg-orange-400'
                          }`}
                        style={{ width: `${Math.min((essay.wordCount / 400) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              />
              <Column
                field="updatedAt"
                header="Última Modificação"
                sortable
                style={{ minWidth: '160px', textAlign: 'center' }}
                headerStyle={{ textAlign: 'center' }}
                body={dateBodyTemplate}
              />
              <Column
                header="Ações"
                style={{ minWidth: '140px', textAlign: 'center' }}
                headerStyle={{ textAlign: 'center' }}
                body={actionBodyTemplate}
              />
            </DataTable>
          </div>
        </Card>
      )}

      {drafts.length > 0 && (
        <Card className="shadow-lg border-0 bg-blue-50">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <i className="pi pi-lightbulb text-blue-500 text-xl mt-1"></i>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">💡 Dicas para seus rascunhos</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Rascunhos são salvos automaticamente enquanto você escreve</li>
                  <li>• Redações com menos de 150 palavras precisam ser expandidas</li>
                  <li>• Você pode enviar rascunhos diretamente para análise quando estiverem prontos</li>
                  <li>• Use rascunhos para experimentar diferentes abordagens do mesmo tema</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Drafts;
