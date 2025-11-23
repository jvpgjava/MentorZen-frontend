import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useEssayStore } from '@/store/essayStore';
import { EssayService } from '@/services/essayService';
import { FeedbackService } from '@/services/feedbackService';
import { Essay, EssayStatus, UserStats } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { showToast } from '@/utils/toast';
import Loading from '@/components/Loading';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { essays, setEssays } = useEssayStore();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentEssays, setRecentEssays] = useState<Essay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      const essaysResponse = await EssayService.getUserEssays(0, 5, 'updatedAt', 'desc');
      const userEssays = essaysResponse.content || [];

      setEssays(userEssays);
      setRecentEssays(userEssays);

      try {
        const stats = await FeedbackService.getUserStats();
        setUserStats(stats);
      } catch (statsError) {
        setUserStats({
          averageScore: 0,
          feedbackCount: 0,
          totalEssays: userEssays.length
        });
      }

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      showToast.error(error.message || 'Erro ao carregar dados do dashboard. Tente novamente.', 'Erro ao Carregar');

      setEssays([]);
      setRecentEssays([]);
      setUserStats({
        averageScore: 0,
        feedbackCount: 0,
        totalEssays: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: EssayStatus) => {
    const statusConfig = {
      [EssayStatus.DRAFT]: { label: 'Rascunho', color: 'text-blue-600' },
      [EssayStatus.SUBMITTED]: { label: 'Enviada', color: 'text-yellow-600' },
      [EssayStatus.ANALYZED]: { label: 'Analisada', color: 'text-green-600' },
      [EssayStatus.ARCHIVED]: { label: 'Arquivada', color: 'text-gray-600' },
    };

    const config = statusConfig[status];
    return (
      <div className="text-center">
        <span className={`font-medium ${config.color}`}>
          {config.label}
        </span>
      </div>
    );
  };

  const getEssayStats = () => {
    const total = essays.length;
    const drafts = essays.filter(e => e.status === EssayStatus.DRAFT).length;
    const analyzed = essays.filter(e => e.status === EssayStatus.ANALYZED).length;
    const submitted = essays.filter(e => e.status === EssayStatus.SUBMITTED).length;

    return { total, drafts, analyzed, submitted };
  };

  const essayStats = getEssayStats();

  const chartData = {
    labels: ['Rascunhos', 'Enviadas', 'Analisadas', 'Arquivadas'],
    datasets: [
      {
        data: [
          essayStats.drafts,
          essayStats.submitted,
          essayStats.analyzed,
          essays.filter(e => e.status === EssayStatus.ARCHIVED).length
        ],
        backgroundColor: [
          '#eab308',
          '#f97316',
          '#22c55e',
          '#6b7280'
        ],
        borderWidth: 0,
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: '60%'
  };

  if (isLoading || !showContent) {
    return <Loading onComplete={() => setShowContent(true)} />;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white rounded-2xl p-8 shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Avatar
              image={user?.profilePictureUrl ? `http://localhost:8080${user.profilePictureUrl}` : undefined}
              label={!user?.profilePictureUrl ? user?.name?.charAt(0).toUpperCase() : undefined}
              className={!user?.profilePictureUrl ? "bg-white text-orange-500 shadow-lg border-2 border-white" : "bg-white shadow-lg border-2 border-white"}
              size="large"
              shape="circle"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Olá, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-white text-opacity-90 text-lg">
                Bem-vindo de volta ao Zen
              </p>
            </div>
          </div>
          <p className="text-white text-opacity-90 text-lg max-w-2xl">
            Continue sua jornada de aprendizado. Aqui você pode acompanhar seu progresso,
            criar novas redações e receber feedback personalizado para melhorar suas habilidades de escrita.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white bg-opacity-5 rounded-full translate-y-16 -translate-x-16"></div>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stats-card bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="stats-card-content">
            <div className="stats-card-text">
              <p className="text-orange-600 text-xs lg:text-sm font-medium mb-2">Total de Redações</p>
              <p className="text-2xl lg:text-3xl font-bold text-orange-600">{essayStats.total}</p>
            </div>
            <div className="stats-card-icon flex items-center justify-center">
              <img
                src="/essay-icons/TodasRedacoesIcon.png"
                alt="Total de Redações"
                className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
              />
            </div>
          </div>
        </div>

        <div className="stats-card bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="stats-card-content">
            <div className="stats-card-text">
              <p className="text-green-600 text-xs lg:text-sm font-medium mb-2">Redações Analisadas</p>
              <p className="text-2xl lg:text-3xl font-bold text-green-600">{essayStats.analyzed}</p>
            </div>
            <div className="stats-card-icon flex items-center justify-center">
              <img
                src="/essay-icons/RedacoesAnalisadasIcon.png"
                alt="Redações Analisadas"
                className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
              />
            </div>
          </div>
        </div>

        <div className="stats-card bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="stats-card-content">
            <div className="stats-card-text">
              <p className="text-yellow-600 text-xs lg:text-sm font-medium mb-2">Nota Média</p>
              <p className="text-2xl lg:text-3xl font-bold text-yellow-600">
                {userStats?.averageScore?.toFixed(0) || '0'}
              </p>
            </div>
            <div className="stats-card-icon flex items-center justify-center">
              <img
                src="/essay-icons/NotaMediaIcon.png"
                alt="Nota Média"
                className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
              />
            </div>
          </div>
        </div>

        <div className="stats-card bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="stats-card-content">
            <div className="stats-card-text">
              <p className="text-blue-600 text-xs lg:text-sm font-medium mb-2">Rascunhos</p>
              <p className="text-2xl lg:text-3xl font-bold text-blue-600">{essayStats.drafts}</p>
            </div>
            <div className="stats-card-icon flex items-center justify-center">
              <img
                src="/essay-icons/RascunhosIcon.png"
                alt="Rascunhos"
                className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-large-cards">
        <div>
          <Card className="h-full shadow-lg border-0">
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <i className="pi pi-chart-pie text-orange-500"></i>
                Distribuição das Redações
              </h3>
              <div className="flex-1 flex flex-col items-center justify-start pt-2">
                <div className="w-full max-w-xs mb-3">
                  <Chart
                    type="doughnut"
                    data={chartData}
                    options={chartOptions}
                    style={{ height: '200px', width: '100%' }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm w-full max-w-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-yellow-500 rounded-full flex-shrink-0 shadow-sm border border-yellow-400"></div>
                    <span className="text-yellow-600 font-medium">Rascunhos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex-shrink-0 shadow-sm border border-orange-400"></div>
                    <span className="text-orange-600 font-medium">Enviadas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex-shrink-0 shadow-sm border border-green-400"></div>
                    <span className="text-green-600 font-medium">Analisadas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-500 rounded-full flex-shrink-0 shadow-sm border border-gray-400"></div>
                    <span className="text-gray-600 font-medium">Arquivadas</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="h-full shadow-lg border-0">
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <i className="pi pi-bolt text-orange-500"></i>
                Ações Rápidas
              </h3>
              <div className="flex-1 flex items-center justify-center">
                <div className="action-buttons-grid w-full">
                  <Button
                    label="Nova Redação"
                    icon="pi pi-plus"
                    className="action-button bg-gradient-to-r from-orange-500 to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white font-medium"
                    onClick={() => navigate('/essays/new')}
                  />

                  <Button
                    label={`Rascunhos ${essayStats.drafts > 0 ? `(${essayStats.drafts})` : ''}`}
                    icon="pi pi-file-edit"
                    className="action-button bg-gradient-to-r from-orange-500 to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white font-medium"
                    onClick={() => navigate('/essays/drafts')}
                  />

                  <Button
                    label="Redações Analisadas"
                    icon="pi pi-check-circle"
                    className="action-button bg-gradient-to-r from-orange-500 to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white font-medium"
                    onClick={() => navigate('/essays/analyzed')}
                  />

                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="shadow-lg border-0">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <i className="pi pi-clock text-orange-500"></i>
            Redações Recentes
          </h3>

          {recentEssays.length > 0 ? (
            <DataTable
              value={recentEssays}
              responsiveLayout="scroll"
              emptyMessage="Nenhuma redação encontrada"
              className="custom-datatable"
              paginator={recentEssays.length > 5}
              rows={5}
            >
              <Column
                field="title"
                header="Título"
                style={{ minWidth: '200px' }}
                body={(essay) => (
                  <div className="font-medium text-gray-900">{essay.title}</div>
                )}
              />
              <Column
                field="theme"
                header="Tema"
                style={{ minWidth: '250px' }}
                body={(essay) => (
                  <span className="text-sm text-gray-600">
                    {essay.theme.length > 80
                      ? `${essay.theme.substring(0, 80)}...`
                      : essay.theme
                    }
                  </span>
                )}
              />
              <Column
                field="wordCount"
                header="Palavras"
                body={(essay) => (
                  <Badge
                    value={essay.wordCount}
                    className="bg-gray-100 text-gray-700"
                  />
                )}
              />
              <Column
                field="status"
                header="Status"
                body={(essay) => getStatusBadge(essay.status)}
              />
              <Column
                field="updatedAt"
                header="Última Atualização"
                body={(essay) => (
                  <span className="text-sm text-gray-500">
                    {format(new Date(essay.updatedAt), "dd 'de' MMM", { locale: ptBR })}
                  </span>
                )}
              />
              <Column
                header="Ações"
                body={(essay) => (
                  <div className="flex gap-3 justify-center">
                    <i
                      className="pi pi-eye text-xl text-orange-500 hover:text-orange-600 cursor-pointer transition-colors"
                      onClick={() => navigate(`/essays/${essay.id}`)}
                      title="Visualizar"
                    ></i>
                    {essay.status === EssayStatus.DRAFT && (
                      <i
                        className="pi pi-pencil text-xl text-orange-500 hover:text-orange-600 cursor-pointer transition-colors"
                        onClick={() => navigate(`/essays/${essay.id}/edit`)}
                        title="Editar"
                      ></i>
                    )}
                    {essay.status === EssayStatus.ANALYZED && (
                      <i
                        className="pi pi-comments text-xl text-orange-500 hover:text-orange-600 cursor-pointer transition-colors"
                        onClick={() => navigate(`/essays/${essay.id}/feedback`)}
                        title="Ver Feedback"
                      ></i>
                    )}
                  </div>
                )}
              />
            </DataTable>
          ) : (
            <div className="text-center py-12">
              <div className="flex items-center justify-center mx-auto mb-6">
                <img
                  src="/essay-icons/TodasRedacoesIcon.png"
                  alt="Redações"
                  className="w-24 h-24 lg:w-28 lg:h-28 object-contain opacity-50"
                />
              </div>
              <h3 className="text-xl text-gray-600 mb-3 font-medium">Nenhuma redação ainda</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Comece criando sua primeira redação e receba feedback personalizado com IA para melhorar suas habilidades!
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

