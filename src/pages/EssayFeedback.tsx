import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { EssayService } from '@/services/essayService';
import { FeedbackService } from '@/services/feedbackService';
import { Essay, EssayStatus, Feedback } from '@/types';
import { showToast } from '@/utils/toast';
import Loading from '@/components/Loading';
import FeedbackViewer from '@/components/FeedbackViewer';

const EssayFeedback: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [essay, setEssay] = useState<Essay | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const maxPollingAttempts = 30;

  useEffect(() => {
    if (id) {
      loadEssayAndFeedback();
    }
  }, [id]);

  const loadEssayAndFeedback = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const essayData = await EssayService.getEssay(Number(id));
      setEssay(essayData);

      // Se a redação está sendo analisada, começa o polling
      if (essayData.status === EssayStatus.SUBMITTED) {
        setIsAnalyzing(true);
        startPollingForFeedback();
      } else if (essayData.status === EssayStatus.ANALYZED) {
        // Se já foi analisada, carrega o feedback
        await loadFeedback();
      } else {
        // Se ainda é rascunho, não tem feedback
        setIsLoading(false);
        setShowContent(true);
      }
    } catch (error: any) {
      showToast.error('Erro ao carregar redação: ' + (error.message || 'Erro desconhecido'), 'Erro ao Carregar');
      navigate('/essays');
    }
  };

  const loadFeedback = async () => {
    if (!id) return;

    try {
      const feedbacks = await FeedbackService.getEssayFeedbacks(Number(id));
      if (feedbacks && feedbacks.length > 0) {
        setFeedback(feedbacks[0]);
        setIsAnalyzing(false);
        setIsLoading(false);
        setShowContent(true);
      } else {
        // Se está analisada mas não tem feedback ainda, continua polling
        if (pollingAttempts < maxPollingAttempts) {
          setTimeout(() => {
            setPollingAttempts(prev => prev + 1);
            loadFeedback();
          }, 2000);
        } else {
          setIsAnalyzing(false);
          setIsLoading(false);
          setShowContent(true);
          showToast.warn('A análise está demorando mais que o esperado. Tente atualizar a página em alguns instantes.', 'Análise em Andamento');
        }
      }
    } catch (error: any) {
      if (pollingAttempts < maxPollingAttempts) {
        setTimeout(() => {
          setPollingAttempts(prev => prev + 1);
          loadFeedback();
        }, 2000);
      } else {
        setIsAnalyzing(false);
        setIsLoading(false);
        setShowContent(true);
        showToast.error('Erro ao carregar feedback: ' + (error.message || 'Erro desconhecido'), 'Erro ao Carregar');
      }
    }
  };

  const startPollingForFeedback = () => {
    let attempts = 0;
    const pollInterval = setInterval(async () => {
      attempts++;
      setPollingAttempts(attempts);

      try {
        // Verifica o status da redação
        const essayData = await EssayService.getEssay(Number(id));
        setEssay(essayData);

        if (essayData.status === EssayStatus.ANALYZED) {
          clearInterval(pollInterval);
          await loadFeedback();
        } else if (attempts >= maxPollingAttempts) {
          clearInterval(pollInterval);
          setIsAnalyzing(false);
          setIsLoading(false);
          setShowContent(true);
          showToast.warn('A análise está demorando mais que o esperado. Tente atualizar a página em alguns instantes.', 'Análise em Andamento');
        }
      } catch (error) {
        if (attempts >= maxPollingAttempts) {
          clearInterval(pollInterval);
          setIsAnalyzing(false);
          setIsLoading(false);
          setShowContent(true);
        }
      }
    }, 2000);
  };

  const handleResend = async () => {
    if (!id) return;

    setIsResending(true);
    try {
      await EssayService.resendForAnalysis(Number(id));
      showToast.success('Redação reenviada para análise com sucesso!', 'Sucesso');
      setFeedback(null);
      setPollingAttempts(0);
      setIsAnalyzing(true);
      startPollingForFeedback();
    } catch (error: any) {
      showToast.error(error.message || 'Erro ao reenviar redação para análise.', 'Erro');
    } finally {
      setIsResending(false);
    }
  };

  if (isLoading || !showContent) {
    return <Loading onComplete={() => setShowContent(true)} />;
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
        <Card className="shadow-lg border-0 bg-white max-w-2xl w-full">
          <div className="p-12 text-center">
            <div className="mb-6">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
            </div>
            <h2 className="text-3xl font-bold text-primary-600 mb-4">
              Analisando sua redação...
            </h2>
            <p className="text-gray-600 text-lg mb-2">
              Nossa IA está analisando sua redação com cuidado
            </p>
            <p className="text-gray-500 text-sm">
              Isso pode levar alguns segundos. Por favor, aguarde.
            </p>
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((pollingAttempts / maxPollingAttempts) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!feedback && essay?.status === EssayStatus.ANALYZED) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
        <Card className="shadow-lg border-0 bg-white max-w-2xl w-full">
          <div className="p-12 text-center">
            <i className="pi pi-exclamation-triangle text-6xl text-[#F2D066] mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Feedback não encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              A redação foi analisada, mas o feedback ainda não está disponível.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#88a7e8] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Atualizar Página
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
        <Card className="shadow-lg border-0 bg-white max-w-2xl w-full">
          <div className="p-12 text-center">
            <i className="pi pi-info-circle text-6xl text-blue-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Redação ainda não analisada
            </h2>
            <p className="text-gray-600 mb-6">
              Esta redação ainda não foi submetida para análise.
            </p>
            <button
              onClick={() => navigate(`/essays/${id}/edit`)}
              className="bg-[#88a7e8] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Editar Redação
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center">
            <img
              src="/essay-icons/RedacoesAnalisadasIcon.png"
              alt="Feedback"
              className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#162A41] mb-2">Feedback da Redação</h1>
            <p className="text-gray-600 text-lg">
              {essay?.title}
            </p>
          </div>
        </div>
        <button
          onClick={handleResend}
          disabled={isResending}
          className="flex items-center gap-2 bg-[#88a7e8] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className={`pi ${isResending ? 'pi-spin pi-spinner' : 'pi-refresh'}`} />
          {isResending ? 'Reenviando...' : 'Solicitar Nova Análise'}
        </button>
      </div>

      <FeedbackViewer feedback={feedback} showEssayInfo={true} />
    </div>
  );
};

export default EssayFeedback;

