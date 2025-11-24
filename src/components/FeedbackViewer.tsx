import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Feedback } from '@/types';

interface FeedbackViewerProps {
  feedback: Feedback;
  showEssayInfo?: boolean;
}

const FeedbackViewer: React.FC<FeedbackViewerProps> = ({
  feedback
}) => {
  const [selectedCompetence, setSelectedCompetence] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getScorePercentage = (score: number | undefined, maxScore: number = 200) => {
    if (!score) return 0;
    return (score / maxScore) * 100;
  };


  const getDetailedAnalysis = (competenceNumber: number): string | undefined => {
    switch (competenceNumber) {
      case 1:
        return feedback.competence1Detailed;
      case 2:
        return feedback.competence2Detailed;
      case 3:
        return feedback.competence3Detailed;
      case 4:
        return feedback.competence4Detailed;
      case 5:
        return feedback.competence5Detailed;
      default:
        return undefined;
    }
  };

  const openCompetenceModal = (competenceNumber: number) => {
    setSelectedCompetence(competenceNumber);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCompetence(null);
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
        <div>
          <h3 className="text-xl font-semibold text-white">
            Análise detalhada com o Mentor Zen
          </h3>
        </div>
      </div>
    </div>
  );

  return (
    <Card header={cardHeader} className="w-full zen-shadow-lg mb-6">
      <div className="space-y-6">
        {feedback.overallScore && (
          <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border-2 border-primary-200">
            <h4 className="text-xl font-bold text-gray-800 mb-3">Nota Geral</h4>
            <div className="text-5xl font-bold text-primary-600 mb-3">
              {feedback.overallScore}
              <span className="text-2xl text-gray-500 font-normal">/1000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${feedback.overallScore >= 800 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  feedback.overallScore >= 600 ? 'bg-[#C7D882]' :
                    feedback.overallScore >= 400 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      'bg-gradient-to-r from-red-500 to-red-600'
                  }`}
                style={{ width: `${getScorePercentage(feedback.overallScore, 1000)}%` }}
              ></div>
            </div>
            <p className={`text-base font-semibold ${feedback.overallScore >= 800 ? 'text-green-700' :
              feedback.overallScore >= 600 ? 'text-primary-700' :
                feedback.overallScore >= 400 ? 'text-yellow-700' :
                  'text-red-700'
              }`}>
              {feedback.overallScore >= 800 ? 'Excelente!' :
                feedback.overallScore >= 600 ? 'Bom!' :
                  feedback.overallScore >= 400 ? 'Regular' : 'Precisa melhorar'}
            </p>
          </div>
        )}

        <div>
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
            <i className="pi pi-comment text-primary-500 text-xl"></i>
            Comentário Geral
          </h4>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-200 shadow-sm">
            <p className="text-gray-800 leading-relaxed text-base">
              {feedback.generalComment}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="pi pi-list text-primary-500"></i>
            Análise por Competências
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competences.map((comp, index) => {
              const competenceNumber = index + 1;
              const hasDetailed = getDetailedAnalysis(competenceNumber);

              return (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200 ${hasDetailed ? 'cursor-pointer hover:border-primary-400' : ''
                    }`}
                  onClick={() => hasDetailed && openCompetenceModal(competenceNumber)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 text-base mb-1">{comp.name}</h5>
                      <p className="text-sm text-gray-600">{comp.description}</p>
                    </div>
                    {comp.score && (
                      <div className={`ml-3 px-3 py-1 rounded-lg font-bold text-sm ${comp.score >= 160 ? 'bg-green-100 text-green-700' :
                        comp.score >= 120 ? 'bg-yellow-100 text-yellow-700' :
                          comp.score >= 80 ? 'bg-primary-100 text-primary-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {comp.score}/200
                      </div>
                    )}
                  </div>

                  {comp.score && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${comp.score >= 160 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            comp.score >= 120 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                              comp.score >= 80 ? 'bg-[#C7D882]' :
                                'bg-gradient-to-r from-red-500 to-red-600'
                            }`}
                          style={{ width: `${getScorePercentage(comp.score)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {getScorePercentage(comp.score).toFixed(0)}%
                      </div>
                    </div>
                  )}

                  {comp.comment && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {comp.comment}
                    </p>
                  )}

                  {hasDetailed && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xs text-primary-600 font-medium flex items-center gap-1">
                        <i className="pi pi-info-circle"></i>
                        Clique para ver análise detalhada
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {feedback.positivePoints && (
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <i className="pi pi-thumbs-up text-green-600 text-xl"></i>
              Pontos Positivos
            </h4>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200 shadow-sm">
              <p className="text-gray-800 leading-relaxed text-base">
                {feedback.positivePoints}
              </p>
            </div>
          </div>
        )}

        {feedback.suggestions && (
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <i className="pi pi-lightbulb text-yellow-600 text-xl"></i>
              Sugestões de Melhoria
            </h4>
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-5 rounded-xl border-2 border-yellow-200 shadow-sm">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line text-base">
                {feedback.suggestions}
              </p>
            </div>
          </div>
        )}

        <Dialog
          header={
            <div className="flex items-center gap-3">
              <i className="pi pi-info-circle text-primary-500 text-2xl"></i>
              <span className="text-xl font-bold text-gray-800">
                {selectedCompetence && competences[selectedCompetence - 1]?.name}
              </span>
            </div>
          }
          visible={modalVisible}
          onHide={closeModal}
          className="w-full max-w-3xl"
          style={{ width: '90vw', maxWidth: '800px' }}
          draggable={false}
          resizable={false}
        >
          {selectedCompetence && (
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">
                  {competences[selectedCompetence - 1]?.description}
                </h5>
                {competences[selectedCompetence - 1]?.score && (
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-lg font-bold ${competences[selectedCompetence - 1].score! >= 160 ? 'bg-green-100 text-green-700' :
                      competences[selectedCompetence - 1].score! >= 120 ? 'bg-yellow-100 text-yellow-700' :
                        competences[selectedCompetence - 1].score! >= 80 ? 'bg-primary-100 text-primary-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                      {competences[selectedCompetence - 1].score}/200
                    </span>
                    <span className="text-sm text-gray-600">
                      {getScorePercentage(competences[selectedCompetence - 1].score).toFixed(0)}% de aproveitamento
                    </span>
                  </div>
                )}
              </div>

              {competences[selectedCompetence - 1]?.comment && (
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-4">
                  <p className="text-gray-800 leading-relaxed">
                    <strong>Análise:</strong> {competences[selectedCompetence - 1].comment}
                  </p>
                </div>
              )}

              {getDetailedAnalysis(selectedCompetence) && (
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-5 rounded-xl border-2 border-primary-200">
                  <h6 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="pi pi-file-edit text-primary-600"></i>
                    Análise Detalhada
                  </h6>
                  <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {getDetailedAnalysis(selectedCompetence)}
                  </div>
                </div>
              )}

              {feedback.lineErrors && selectedCompetence && (
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                  <h6 className="font-semibold text-red-800 mb-2">Pontos de Atenção</h6>
                  <p className="text-red-700 text-sm leading-relaxed whitespace-pre-line">
                    {feedback.lineErrors}
                  </p>
                </div>
              )}
            </div>
          )}
        </Dialog>

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

