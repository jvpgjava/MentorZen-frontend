# Mentor de Redação Zen - Frontend

Interface web moderna e responsiva desenvolvida em React com TypeScript para o sistema Mentor de Redação Zen, uma solução inovadora que utiliza Inteligência Artificial para apoiar estudantes do ensino médio no desenvolvimento de suas habilidades de escrita para o ENEM, com foco especial em saúde mental e bem-estar emocional.

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Executando a Aplicação](#executando-a-aplicação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Integração com Backend](#integração-com-backend)
- [Build para Produção](#build-para-produção)
- [Troubleshooting](#troubleshooting)

## Sobre o Projeto

O Mentor de Redação Zen é uma plataforma educacional desenvolvida para o Hackathon Gemini for Education 2025. O frontend oferece uma interface intuitiva e moderna para que estudantes possam criar redações, receber feedback automatizado e empático baseado nas 5 competências do ENEM, sempre priorizando o bem-estar mental.

### Funcionalidades Principais

- **Autenticação Completa**: Sistema de login, registro e recuperação de senha
- **Gestão de Redações**: Criação, edição, visualização e organização de redações
- **Editor de Texto**: Interface rica para escrita com contador de palavras em tempo real
- **Visualização de Feedbacks**: Apresentação detalhada de feedbacks da IA com scores por competência
- **Dashboard Interativo**: Visão geral com estatísticas e redações recentes
- **Perfil Personalizado**: Gerenciamento completo do perfil com upload de foto
- **Sistema de Rascunhos**: Salvar e continuar redações posteriormente
- **Filtros e Busca**: Ferramentas avançadas para encontrar redações e feedbacks
- **Design Responsivo**: Interface adaptável para desktop, tablet e mobile

## Arquitetura

O projeto segue uma arquitetura modular e escalável, organizando o código em camadas bem definidas:

### Estrutura de Diretórios

```
src/
├── components/          # Componentes reutilizáveis
│   ├── EssayEditor.tsx  # Editor de redações
│   ├── FeedbackViewer.tsx # Visualizador de feedbacks
│   └── Layout.tsx       # Layout principal com navegação
│
├── pages/               # Páginas da aplicação
│   ├── Login.tsx        # Autenticação
│   ├── Register.tsx     # Registro de usuário
│   ├── Dashboard.tsx     # Painel principal
│   ├── NewEssay.tsx     # Criação de redação
│   ├── Drafts.tsx       # Rascunhos
│   ├── AnalyzedEssays.tsx # Redações analisadas
│   ├── Feedbacks.tsx    # Lista de feedbacks
│   └── Profile.tsx      # Perfil do usuário
│
├── services/            # Serviços de API
│   ├── apiClient.ts    # Cliente HTTP configurado
│   ├── authService.ts  # Autenticação
│   ├── essayService.ts # Redações
│   ├── feedbackService.ts # Feedbacks
│   └── profileService.ts # Perfil
│
├── store/              # Gerenciamento de estado
│   ├── authStore.ts    # Estado de autenticação
│   └── essayStore.ts   # Estado de redações
│
├── types/              # Definições TypeScript
│   └── index.ts        # Interfaces e tipos
│
├── config/             # Configurações
│   └── index.ts        # Configurações da aplicação
│
└── styles/             # Estilos customizados
    └── layout.css      # Estilos do layout
```

### Decisões de Arquitetura

**Por que React com TypeScript?**

- **Type Safety**: TypeScript oferece verificação de tipos em tempo de compilação, reduzindo erros em produção
- **Ecossistema Maduro**: React possui uma das maiores comunidades e ecossistemas de bibliotecas
- **Componentização**: Facilita a criação de componentes reutilizáveis e manutenção do código
- **Performance**: Virtual DOM e otimizações do React garantem boa performance
- **Developer Experience**: Ferramentas excelentes para desenvolvimento e debugging

**Por que Vite?**

- **Build Rápido**: Compilação extremamente rápida comparado a outras ferramentas
- **Hot Module Replacement**: Atualização instantânea durante desenvolvimento
- **Otimizações Automáticas**: Code splitting e tree shaking automáticos
- **ES Modules Nativo**: Suporte nativo a módulos ES, melhorando a experiência de desenvolvimento
- **Configuração Simples**: Menos configuração necessária comparado ao Webpack

**Por que Zustand para Gerenciamento de Estado?**

- **Simplicidade**: API simples e intuitiva, sem boilerplate excessivo
- **Performance**: Menor overhead comparado a outras soluções
- **TypeScript First**: Suporte nativo e excelente para TypeScript
- **Persistência**: Middleware de persistência integrado para salvar estado no localStorage
- **Leve**: Bundle pequeno, não adiciona peso significativo à aplicação

**Por que PrimeReact?**

- **Componentes Ricos**: Biblioteca completa de componentes UI profissionais
- **Customizável**: Fácil customização através de CSS e props
- **Acessibilidade**: Componentes seguem padrões de acessibilidade (WCAG)
- **Documentação**: Documentação completa e exemplos
- **Temas**: Sistema de temas integrado

**Por que Tailwind CSS?**

- **Utility-First**: Abordagem que permite desenvolvimento rápido
- **Customizável**: Configuração flexível através do `tailwind.config.js`
- **Performance**: Gera apenas CSS necessário, mantendo bundle pequeno
- **Consistência**: Design system consistente através de classes utilitárias
- **Produtividade**: Desenvolvimento mais rápido sem precisar escrever CSS customizado

**Por que Axios?**

- **Interceptors**: Facilita adicionar tokens de autenticação automaticamente
- **Error Handling**: Tratamento de erros centralizado e robusto
- **Request/Response Transformation**: Transformação automática de dados
- **Cancelamento**: Suporte a cancelamento de requisições
- **Browser/Node**: Funciona tanto no browser quanto no Node.js

## Tecnologias Utilizadas

### Core

- **React 18.2.0**: Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.2.2**: Superset do JavaScript com tipagem estática
- **Vite 5.0.8**: Build tool e dev server moderno

### Roteamento

- **React Router DOM 6.20.0**: Roteamento declarativo para aplicações React

### Gerenciamento de Estado

- **Zustand 4.4.7**: Biblioteca leve para gerenciamento de estado
- **Zustand Persist 0.4.0**: Middleware para persistência de estado

### UI Components

- **PrimeReact 9.2.2**: Biblioteca de componentes UI
- **PrimeIcons 6.0.1**: Ícones para PrimeReact
- **PrimeFlex 3.3.1**: Sistema de grid e utilitários CSS

### Estilização

- **Tailwind CSS 3.3.6**: Framework CSS utility-first
- **PostCSS 8.4.32**: Processador CSS
- **Autoprefixer 10.4.16**: Adiciona prefixos de vendor automaticamente

### HTTP Client

- **Axios 1.6.2**: Cliente HTTP baseado em Promises

### Formulários e Validação

- **React Hook Form 7.49.2**: Biblioteca para gerenciamento de formulários
- **Zod 3.22.4**: Schema validation com TypeScript
- **@hookform/resolvers 3.3.2**: Resolvers para React Hook Form

### Notificações

- **React Hot Toast 2.4.1**: Sistema de notificações toast elegante

### Gráficos

- **Chart.js 4.4.0**: Biblioteca de gráficos
- **React Chart.js 2 5.2.0**: Wrapper React para Chart.js

### Utilitários

- **date-fns 3.0.6**: Biblioteca para manipulação de datas

### Desenvolvimento

- **ESLint 8.55.0**: Linter para JavaScript/TypeScript
- **TypeScript ESLint**: Plugins ESLint para TypeScript

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js 18 ou superior**
   ```bash
   node --version
   ```
   Se não tiver instalado, baixe em: https://nodejs.org/

2. **npm ou yarn** (vem com Node.js)
   ```bash
   npm --version
   ```

3. **Git** (opcional, para clonar o repositório)
   ```bash
   git --version
   ```

4. **Backend rodando** (veja README do backend)
   - O backend deve estar rodando em `http://localhost:8080`
   - Ou configure a URL do backend nas variáveis de ambiente

## Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd MentorZen/frontend
```

### 2. Instalar Dependências

```bash
npm install
```

Este comando irá instalar todas as dependências listadas no `package.json`.

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend:

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Mentor de Redação Zen
VITE_APP_VERSION=1.0.0
```

**Importante**: O arquivo `.env` não deve ser commitado no Git. Ele já está no `.gitignore`.

### 4. Verificar Configuração do Backend

Certifique-se de que o backend está rodando e acessível:

- Backend deve estar em `http://localhost:8080`
- CORS deve estar configurado para aceitar requisições de `http://localhost:3000`
- Verifique o arquivo `application.properties` do backend

## Variáveis de Ambiente

O projeto utiliza variáveis de ambiente prefixadas com `VITE_` (requisito do Vite). As principais variáveis são:

### Obrigatórias

- `VITE_API_BASE_URL`: URL base da API do backend (padrão: `http://localhost:8080/api`)

### Opcionais

- `VITE_APP_NAME`: Nome da aplicação (padrão: "Mentor de Redação Zen")
- `VITE_APP_VERSION`: Versão da aplicação (padrão: "1.0.0")
- `VITE_APP_DESCRIPTION`: Descrição da aplicação
- `VITE_DEV_MODE`: Modo de desenvolvimento (`true` ou `false`)
- `VITE_SHOW_DEBUG_INFO`: Mostrar informações de debug (`true` ou `false`)
- `VITE_DEFAULT_THEME`: Tema padrão (`light` ou `dark`)
- `VITE_BRAND_COLOR`: Cor principal da marca (padrão: `#f97316`)
- `VITE_MAX_ESSAY_LENGTH`: Tamanho máximo da redação (padrão: `5000`)
- `VITE_MIN_ESSAY_LENGTH`: Tamanho mínimo da redação (padrão: `150`)
- `VITE_AUTO_SAVE_INTERVAL`: Intervalo de auto-save em ms (padrão: `30000`)

### Exemplo de Arquivo .env

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Mentor de Redação Zen
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=true
```

## Executando a Aplicação

### Modo de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:3000`

O Vite irá:
- Iniciar o servidor de desenvolvimento
- Compilar o código automaticamente
- Recarregar a página quando houver mudanças (Hot Module Replacement)
- Mostrar erros no console e na interface

### Modo de Produção (Preview)

Para testar o build de produção localmente:

```bash
npm run build
npm run preview
```

### Linting

Para verificar problemas no código:

```bash
npm run lint
```

## Estrutura do Projeto

### Componentes Principais

**Layout.tsx**
- Componente principal que envolve todas as páginas autenticadas
- Contém a barra de navegação lateral e superior
- Gerencia o menu do usuário e logout

**EssayEditor.tsx**
- Editor de redações com contador de palavras
- Validação em tempo real
- Integração com React Hook Form e Zod

**FeedbackViewer.tsx**
- Visualização detalhada de feedbacks
- Exibe scores por competência
- Apresenta comentários e sugestões

### Páginas

**Login.tsx / Register.tsx**
- Autenticação e registro de usuários
- Validação de formulários
- Integração com backend via AuthService

**Dashboard.tsx**
- Visão geral do usuário
- Estatísticas de redações e feedbacks
- Gráficos de performance
- Redações recentes

**NewEssay.tsx**
- Criação de novas redações
- Seleção de tema e tipo
- Editor de texto com validação

**Drafts.tsx / AnalyzedEssays.tsx / AllEssays.tsx**
- Listagem de redações por status
- Filtros e busca
- Ações rápidas (editar, visualizar, excluir)

**Feedbacks.tsx**
- Lista de todos os feedbacks recebidos
- Filtros por tipo de feedback
- Navegação para detalhes

**Profile.tsx**
- Gerenciamento de perfil
- Upload de foto
- Alteração de senha
- Exclusão de conta

### Serviços

**apiClient.ts**
- Cliente HTTP centralizado usando Axios
- Interceptors para adicionar token JWT automaticamente
- Tratamento centralizado de erros (401, 403, 500, etc.)
- Redirecionamento automático para login em caso de sessão expirada

**authService.ts**
- Métodos para autenticação (login, register, forgot password, reset password)
- Integração com endpoints `/auth/*` do backend

**essayService.ts**
- CRUD completo de redações
- Busca e filtros
- Submissão para análise

**feedbackService.ts**
- Busca de feedbacks por redação ou usuário
- Estatísticas do usuário

**profileService.ts**
- Atualização de perfil
- Upload de foto
- Alteração de senha
- Exclusão de conta

### Store (Gerenciamento de Estado)

**authStore.ts**
- Estado global de autenticação
- Persistência no localStorage
- Métodos para login, logout, registro
- Atualização de dados do usuário

**essayStore.ts**
- Estado local de redações
- Cache de redações carregadas
- Métodos auxiliares para filtrar por status

### Configuração

**config/index.ts**
- Configurações centralizadas da aplicação
- Leitura de variáveis de ambiente
- Logger customizado
- Configurações de validação e features

## Funcionalidades

### Autenticação

- Login com email e senha
- Registro de novos usuários
- Recuperação de senha via email
- Sessão persistente (token salvo no localStorage)
- Logout com limpeza de dados

### Gestão de Redações

- Criação de redações com título, tema e conteúdo
- Editor de texto com contador de palavras em tempo real
- Validação de tamanho mínimo e máximo
- Salvamento como rascunho
- Envio para análise
- Edição de redações existentes
- Exclusão de redações
- Visualização de redações analisadas

### Feedbacks

- Visualização de feedbacks recebidos
- Detalhamento por competência (5 competências do ENEM)
- Scores individuais e geral
- Comentários e sugestões
- Filtros por tipo de feedback (IA, Humano, Pares)

### Perfil do Usuário

- Visualização e edição de informações pessoais
- Upload de foto de perfil (até 25MB)
- Alteração de senha
- Exclusão de conta

### Dashboard

- Estatísticas gerais (total de redações, feedbacks, média de notas)
- Gráficos de performance
- Redações recentes
- Acesso rápido às principais funcionalidades

## Integração com Backend

### Autenticação

O frontend utiliza JWT (JSON Web Tokens) para autenticação:

1. Usuário faz login através de `/auth/login`
2. Backend retorna um token JWT
3. Token é armazenado no localStorage via Zustand Persist
4. Todas as requisições subsequentes incluem o token no header `Authorization: Bearer <token>`
5. Em caso de token expirado (401), o usuário é redirecionado para login

### Endpoints Utilizados

**Autenticação:**
- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `POST /auth/forgot-password` - Solicitar recuperação de senha
- `POST /auth/reset-password` - Redefinir senha
- `GET /auth/me` - Obter usuário atual

**Redações:**
- `GET /essays` - Listar redações (com paginação)
- `GET /essays/{id}` - Obter redação específica
- `POST /essays` - Criar redação
- `PUT /essays/{id}` - Atualizar redação
- `DELETE /essays/{id}` - Excluir redação
- `GET /essays/status/{status}` - Filtrar por status
- `POST /essays/{id}/submit` - Enviar para análise

**Feedbacks:**
- `GET /feedbacks/user` - Feedbacks do usuário
- `GET /feedbacks/essay/{essayId}` - Feedbacks de uma redação
- `GET /feedbacks/{id}` - Feedback específico
- `GET /feedbacks/user/stats` - Estatísticas do usuário

**Perfil:**
- `GET /profile` - Obter perfil
- `PUT /profile` - Atualizar perfil
- `POST /profile/picture` - Upload de foto
- `PUT /profile/password` - Alterar senha
- `DELETE /profile` - Excluir conta

### Tratamento de Erros

O `apiClient` trata automaticamente os seguintes erros:

- **401 Unauthorized**: Token expirado ou inválido - redireciona para login
- **403 Forbidden**: Acesso negado - mostra mensagem de erro
- **500+ Server Error**: Erro interno do servidor - mostra mensagem genérica
- **Network Error**: Problema de conexão - mostra mensagem de erro de rede

## Build para Produção

### Gerar Build de Produção

```bash
npm run build
```

Este comando irá:
- Compilar TypeScript
- Fazer bundle e minificação do código
- Otimizar assets
- Gerar arquivos estáticos na pasta `dist/`

### Estrutura do Build

Após o build, a pasta `dist/` conterá:

```
dist/
├── index.html          # HTML principal
├── assets/
│   ├── index-[hash].js # JavaScript bundle
│   └── index-[hash].css # CSS bundle
└── ...
```

### Deploy

Os arquivos na pasta `dist/` podem ser servidos por qualquer servidor web estático:

- **Nginx**: Configure para servir a pasta `dist/`
- **Apache**: Configure DocumentRoot para `dist/`
- **Vercel/Netlify**: Conecte o repositório e configure o build command
- **AWS S3 + CloudFront**: Faça upload da pasta `dist/` para S3

### Variáveis de Ambiente em Produção

Certifique-se de configurar as variáveis de ambiente no ambiente de produção:

- Configure `VITE_API_BASE_URL` para a URL do backend em produção
- Ajuste outras variáveis conforme necessário

## Troubleshooting

### Problema: Erro de CORS ao fazer requisições

**Solução:**
- Verifique se o backend está configurado para aceitar requisições do frontend
- Confirme que `CORS_ALLOWED_ORIGINS` no backend inclui a URL do frontend
- Verifique se o backend está rodando e acessível

### Problema: Token não está sendo enviado nas requisições

**Solução:**
- Verifique se o login foi realizado com sucesso
- Confirme que o token está sendo salvo no localStorage
- Verifique os interceptors do `apiClient.ts`
- Limpe o localStorage e faça login novamente

### Problema: Página em branco após build

**Solução:**
- Verifique se há erros no console do navegador
- Confirme que o `base` no `vite.config.ts` está correto
- Verifique se os assets estão sendo carregados corretamente
- Teste com `npm run preview` antes de fazer deploy

### Problema: Estilos não estão sendo aplicados

**Solução:**
- Verifique se o Tailwind CSS está configurado corretamente
- Confirme que o `index.css` está sendo importado no `main.tsx`
- Verifique o `tailwind.config.js` e `postcss.config.cjs`
- Limpe o cache e reinstale as dependências: `rm -rf node_modules && npm install`

### Problema: Erro "Cannot find module" ou imports não funcionam

**Solução:**
- Verifique os path aliases no `vite.config.ts` e `tsconfig.json`
- Confirme que os imports estão usando os aliases corretos (`@/components`, etc.)
- Reinstale as dependências: `npm install`
- Verifique se o TypeScript está configurado corretamente

### Problema: Hot Module Replacement não está funcionando

**Solução:**
- Verifique se o Vite está rodando na porta correta (3000)
- Confirme que não há conflitos de porta
- Reinicie o servidor de desenvolvimento
- Verifique se há erros no console

### Problema: Build falha com erros de TypeScript

**Solução:**
- Execute `npm run lint` para ver todos os erros
- Corrija os erros de tipo indicados
- Verifique se todas as dependências estão instaladas
- Confirme que o `tsconfig.json` está configurado corretamente

## Desenvolvimento

### Adicionando Novas Páginas

1. Crie o componente da página em `src/pages/`
2. Adicione a rota em `src/App.tsx`
3. Adicione o link no menu em `src/components/Layout.tsx` (se necessário)

### Adicionando Novos Serviços

1. Crie o arquivo do serviço em `src/services/`
2. Use o `apiClient` para fazer requisições HTTP
3. Defina os tipos TypeScript em `src/types/index.ts`

### Adicionando Novos Componentes

1. Crie o componente em `src/components/`
2. Use TypeScript para tipagem
3. Siga os padrões de estilo existentes (Tailwind CSS)
4. Documente props e funcionalidades

### Padrões de Código

- Use TypeScript para todas as funcionalidades
- Siga a convenção de nomes: PascalCase para componentes, camelCase para funções
- Use hooks do React para lógica de estado
- Mantenha componentes pequenos e focados
- Use o Zustand para estado global quando necessário
- Prefira componentes funcionais com hooks

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo `LICENSE` para mais detalhes.

## Equipe

Desenvolvido pela Equipe FloWrite para o Hackathon Gemini for Education 2025.

