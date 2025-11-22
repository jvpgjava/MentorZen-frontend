import React from 'react';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { ProgressBar } from 'primereact/progressbar';
import { Chip } from 'primereact/chip';
import { Feedback, FeedbackType } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeedbackViewerProps {
  feedback: Feedback;
  showEssayInfo?: boolean;
}

const FeedbackViewer: React.FC<FeedbackViewerProps> = ({
  feedback,
  showEssayInfo = false
}) => {
  const getScoreColor = (score: number | undefined) => {
    if (!score) return 'text-gray-400';
    if (score >= 160) return 'text-green-600';
    if (score >= 120) return 'text-yellow-600';
    if (score >= 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScorePercentage = (score: number | undefined, maxScore: number = 200) => {
    if (!score) return 0;
    return (score / maxScore) * 100;
  };

  const getFeedbackTypeLabel = (type: FeedbackType) => {
    switch (type) {
      case FeedbackType.AI_GENERATED:
        return 'IA Mentor Zen';
      case FeedbackType.HUMAN_REVIEW:
        return 'Revisão Humana';
      case FeedbackType.PEER_REVIEW:
        return 'Revisão de Pares';
      default:
        return 'Desconhecido';
    }
  };

  const getFeedbackTypeIcon = (type: FeedbackType) => {
    switch (type) {
      case FeedbackType.AI_GENERATED:
        return 'pi pi-android';
      case FeedbackType.HUMAN_REVIEW:
        return 'pi pi-user';
      case FeedbackType.PEER_REVIEW:
        return 'pi pi-users';
      default:
        return 'pi pi-question';
    }
  };

  const competences = [
    {
      name: 'Competência 1',
      description: 'Domínio da escrita formal',
      score: feedback.competence1Score,
      comment: feedback.competence1Comment
    },
    {
      name: 'Competência 2',
      description: 'Compreensão e desenvolvimento do tema',
      score: feedback.competence2Score,
      comment: feedback.competence2Comment
    },
    {
      name: 'Competência 3',
      description: 'Argumentação e repertório sociocultural',
      score: feedback.competence3Score,
      comment: feedback.competence3Comment
    },
    {
      name: 'Competência 4',
      description: 'Coesão e coerência',
      score: feedback.competence4Score,
      comment: feedback.competence4Comment
    },
    {
      name: 'Competência 5',
      description: 'Proposta de intervenção',
      score: feedback.competence5Score,
      comment: feedback.competence5Comment
    }
  ];

  const cardHeader = (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <i className={`${getFeedbackTypeIcon(feedback.type)} text-2xl text-white`}></i>
        <div>
          <h3 className="text-xl font-semibold text-white">
            Feedback - {getFeedbackTypeLabel(feedback.type)}
          </h3>
          <p className="text-white text-opacity-80 text-sm">
            {format(new Date(feedback.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
              locale: ptBR
            })}
          </p>
        </div>
      </div>

      {feedback.overallScore && (
        <div className="text-center">
          <div className="text-3xl font-bold text-white">
            {feedback.overallScore}
          </div>
          <div className="text-white text-opacity-80 text-sm">
            / 1000
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card header={cardHeader} className="w-full zen-shadow-lg mb-6">
      <div className="space-y-6">
        {feedback.overallScore && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Nota Geral</h4>
            <div className="text-4xl font-bold zen-gradient-text mb-2">
              {feedback.overallScore}
            </div>
            <ProgressBar
              value={getScorePercentage(feedback.overallScore, 1000)}
              className="mb-2"
              style={{ height: '8px' }}
            />
            <p className="text-sm text-gray-600">
              {feedback.overallScore >= 800 ? 'Excelente!' :
                feedback.overallScore >= 600 ? 'Bom!' :
                  feedback.overallScore >= 400 ? 'Regular' : 'Precisa melhorar'}
            </p>
          </div>
        )}

        <div>
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <i className="pi pi-comment text-orange-500"></i>
            Comentário Geral
          </h4>
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <p className="text-gray-700 leading-relaxed">
              {feedback.generalComment}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="pi pi-list text-orange-500"></i>
            Análise por Competências
          </h4>

          <div className="grid gap-4">
            {competences.map((comp, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-semibold text-gray-800">{comp.name}</h5>
                    <p className="text-sm text-gray-600">{comp.description}</p>
                  </div>
                  {comp.score && (
                    <Chip
                      label={`${comp.score}/200`}
                      className={`${getScoreColor(comp.score)} bg-gray-100`}
                    />
                  )}
                </div>

                {comp.score && (
                  <ProgressBar
                    value={getScorePercentage(comp.score)}
                    className="mb-3"
                    style={{ height: '6px' }}
                  />
                )}

                {comp.comment && (
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                    {comp.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {feedback.positivePoints && (
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <i className="pi pi-thumbs-up text-green-500"></i>
              Pontos Positivos
            </h4>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <p className="text-gray-700 leading-relaxed">
                {feedback.positivePoints}
              </p>
            </div>
          </div>
        )}

        {feedback.suggestions && (
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <i className="pi pi-lightbulb text-yellow-500"></i>
              Sugestões de Melhoria
            </h4>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {feedback.suggestions}
              </p>
            </div>
          </div>
        )}

        {feedback.reviewer && (
          <div className="flex items-center gap-3 pt-4 border-t">
            <i className="pi pi-user text-gray-400"></i>
            <span className="text-sm text-gray-600">
              Revisado por: <strong>{feedback.reviewer.name}</strong>
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FeedbackViewer;

