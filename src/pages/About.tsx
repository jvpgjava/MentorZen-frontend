import React from 'react';
import { Card } from 'primereact/card';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Eduardo Mello Garcia',
      photo: '/profile-icons/EduardoMelloFoto.png'
    },
    {
      name: 'Gabriel Oliveira de Matos',
      photo: '/profile-icons/GabrielFoto.png'
    },
    {
      name: 'João Gabriel Abreu Baumhardt da Silva',
      photo: '/profile-icons/JoaoGabrielFoto.png'
    },
    {
      name: 'João Vitor Prestes Grando',
      photo: '/profile-icons/JoaoVitorFoto.png'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-xl flex items-center justify-center">
          <img
            src="/assets/robotIcon.png"
            alt="Zen Robot Icon"
            className="w-24 h-24 lg:w-28 lg:h-28 object-contain"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-[#4472d6] mb-2">Sobre o Zen</h1>
          <p className="text-gray-600 text-lg font-medium">
            Escrita Consciente com Inteligência Artificial
          </p>
        </div>
      </div>

      <Card className="shadow-lg border-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <i className="pi pi-heart text-[#4472d6] text-xl"></i>
            Nossa Missão
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Objetivo</h3>
              <p className="text-gray-600 leading-relaxed">
                O Zen é uma plataforma inovadora que combina inteligência artificial avançada com cuidado humano para apoiar estudantes do ensino médio em sua jornada de preparação para o ENEM. Utilizamos IA de última geração para análise de redações, oferecendo feedback personalizado e insights valiosos. Nosso foco vai além da correção técnica - priorizamos o bem-estar emocional e a confiança dos estudantes, garantindo privacidade e segurança com os mais altos padrões de proteção de dados.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Diferencial</h3>
              <p className="text-gray-600 leading-relaxed">
                Criamos um ambiente seguro e encorajador onde os estudantes podem praticar e aperfeiçoar suas habilidades de escrita sem medo de julgamento. Nossa plataforma é totalmente responsiva e acessível, permitindo que você estude onde e quando quiser, em qualquer dispositivo. Nossa IA oferece feedback construtivo e empático, promovendo o aprendizado iterativo e o crescimento pessoal.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Valores</h3>
              <p className="text-gray-600 leading-relaxed">
                Acreditamos que a saúde mental deve estar em primeiro lugar, proporcionando um aprendizado sem pressão através de feedback construtivo e empático. Promovemos o crescimento através da prática iterativa, utilizando tecnologia a serviço da educação, sempre garantindo privacidade e segurança em todos os processos.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="shadow-lg border-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <i className="pi pi-users text-[#4472d6] text-xl"></i>
            Nossa Equipe - FloWrite
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Somos uma equipe apaixonada por educação e tecnologia, unidos pelo objetivo de tornar o aprendizado mais acessível e humanizado. Cada membro traz sua expertise única para criar uma experiência verdadeiramente transformadora.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-4 border-[#4472d6]">
                  <img
                    src={member.photo}
                    alt={`Foto de ${member.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </Card>


      <Card className="shadow-lg border-0">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <i className="pi pi-envelope text-[#4472d6] text-xl"></i>
            Entre em Contato
          </h2>
          <p className="text-gray-600 mb-6">
            Tem sugestões, dúvidas ou quer saber mais sobre o Zen? Adoraríamos ouvir você!
          </p>
          <div className="flex justify-center gap-4">
            <div className="bg-[#4472d6] px-4 py-2 rounded-lg">
              <span className="text-white font-medium">zen.edu@gmail.com</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default About;
