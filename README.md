
# 📚 Sistema de Biblioteca Pessoal

Sistema full-stack para gerenciar biblioteca pessoal conectado ao Notion como banco de dados.

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express** - Servidor e API REST
- **Notion API** - Banco de dados
- **dotenv** - Gerenciamento de variáveis de ambiente
- **cors** - Habilita comunicação frontend/backend

### Frontend
- **Vue 3** - Framework progressivo
- **Pinia** - Gerenciamento de estado
- **Vue Router** - Navegação entre páginas
- **Vite** - Build tool e dev server

## 📁 Estrutura do Projeto
```
projeto/
│
├── backend/                          # Servidor Node.js
│   ├── config/
│   │   └── notion.js                 # Configuração do Notion (chaves secretas)
│   │
│   ├── services/
│   │   ├── list.js                   # Busca livros do Notion
│   │   └── create.js                 # Cria livros no Notion
│   │
│   ├── routes/
│   │   └── books.js                  # Rotas da API (/api/books)
│   │
│   ├── server.js                     # Arquivo principal do servidor
│   ├── .env                          # Variáveis secretas (NÃO commitar!)
│   ├── package.json                  # Dependências do backend
│   └── test-rest.js                  # Testes (opcional)
│
└── biblioteca-livros/                # Frontend Vue 3
    ├── src/
    │   ├── assets/                   # Imagens, estilos globais
    │   │
    │   ├── components/               # Componentes reutilizáveis
    │   │   ├── BookCard.vue          # Card de um livro
    │   │   ├── BookForm.vue          # Formulário de cadastro
    │   │   ├── BookList.vue          # Lista de livros
    │   │   └── Pagination.vue        # Controles de paginação
    │   │
    │   ├── stores/
    │   │   └── bookStore.js          # Estado global (Pinia)
    │   │
    │   ├── services/
    │   │   └── api.js                # Comunicação com backend
    │   │
    │   ├── views/                    # Páginas
    │   │   ├── HomeView.vue          # Página inicial (lista)
    │   │   └── CreateBookView.vue    # Página de cadastro
    │   │
    │   ├── router/
    │   │   └── index.js              # Configuração de rotas
    │   │
    │   ├── App.vue                   # Componente raiz
    │   └── main.js                   # Ponto de entrada
    │
    ├── index.html                    # HTML principal
    ├── package.json                  # Dependências do frontend
    └── vite.config.js                # Configuração do Vite

```
## Instalação

#### 1. Configurar Notion

Crie uma integration em: https://www.notion.so/my-integrations
Copie a Integration Token
Crie um database no Notion com as colunas:

Name (title)
Author (multi-select)
Status (select)
Total (number)
Currently on (number)
Type (multi-select)
Rate (select)
I have a copy of this (checkbox)
First published in (select)


Compartilhe o database com sua integration (3 pontinhos → Add connections)
Copie o Database ID da URL

### 2. Backend

```bash
    cd backend
    npm install
    # Criar arquivo .env
    echo "NOTION_API_KEY=seu_token_aqui" > .env
    echo "NOTION_DATABASE_ID=seu_database_id_aqui" >> .env
echo "PORT=3000" >> .env

    # Iniciar servidor
    npm run dev
```

### 3. Frontend

```bash
    cd biblioteca-livros
    npm install

    # Iniciar aplicação
    npm run dev
```

### 4. Acessar

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API: http://localhost:3000/api/books

---



## 📖 Funcionalidades Implementadas

- Listar livros com paginação (20 por página)
- Buscar por título ou autor
- Filtrar por status (Reading, Completed, To Read)
- Criar novo livro
- Cache inteligente (5 minutos)
- Navegação entre páginas
- Visualização de progresso de leitura
- Design responsivo
- Suporte a +100 livros (paginação no backend)
- Dark Mode

## 🚀 Lista de Melhorias Futuras

###  🎨 Interface e UX
 
#### **Alta Prioridade**

- **Dark Mode** - FEITO
   - Adicionar toggle de tema claro/escuro ✓
   - Persistir preferência no localStorage ✓
   - Ícone de sol/lua no header            ✓ 

- **Loading Skeletons**
   - Substituir spinner por skeleton screens
   - Melhor feedback visual durante carregamento
   - Cards "fantasmas" enquanto carrega

- **Toast Notifications**
   - Notificações de sucesso/erro mais elegantes
   - Biblioteca: vue-toastification ou custom
   - Posição: canto superior direito

- **Confirmação de Ações**
   - Modal de confirmação antes de criar livro
   - "Tem certeza que quer sair sem salvar?"
   - Desfazer ações recentes

- **Imagens de Capa**
   - Exibir capas dos livros nos cards         ✓
   - Upload de imagens ou URL
   - Placeholder bonito quando não tiver capa

#### **Média Prioridade**

- **Ordenação**
   - Ordenar por: nome, data, avaliação, progresso
   - Ordem crescente/decrescente
   - Lembrar última ordenação usada

- **Visualizações Alternativas**
   - Modo lista (compacto)
   - Modo grid (atual)
   - Modo tabela (detalhado)

- **Animações e Transições**
   - Transições suaves entre páginas
   - Animações ao adicionar/remover livros
   - Fade-in dos cards

- **Busca Avançada**
    - Busca com autocomplete
    - Sugestões enquanto digita
    - Highlight dos termos encontrados


---
### 📊 **Funcionalidades**
#### **Alta Prioridade**

 - **Editar Livro**
    - Botão "Editar" no card
    - Modal ou página de edição
    - PUT /api/books/:id

- **Deletar Livro**
    - Botão "Excluir" no card
    - Confirmação antes de deletar
    - DELETE /api/books/:id

- **Estatísticas**
    - Dashboard com gráficos
    - Total de livros, páginas lidas
    - Livros por status, tipo, autor
    - Biblioteca: Chart.js ou Recharts

- **Metas de Leitura**
    - Definir meta anual (ex: 50 livros/ano)
    - Progresso da meta
    - Gráfico de acompanhamento

- **Sistema de Tags**
    - Tags customizadas (além dos tipos)
    - Filtrar por tags
    - Nuvem de tags ??

#### Média Prioridade

- **Exportar Dados**
    - Exportar lista em CSV
    - Exportar em PDF (relatório bonito)
    - Exportar backup JSON

- **Importar Dados**
    - Importar CSV
    - Importar de Goodreads
    - Drag & drop de arquivo

- **Notas e Citações**
    - Adicionar notas pessoais
    - Salvar citações favoritas
    - Marcar páginas importantes

- **Histórico de Leitura**
    - Timeline de quando leu cada livro
    - Data de início e fim
    - Tempo total de leitura



#### Baixa Prioridade
- **Avaliação Detalhada**
    - Avaliação por critérios (plot, personagens, etc)
    - Escala de 0-10 ao invés de estrelas
    - Comentários e reviews

- **Integração com APIs Externas**
    - Buscar info no Google Books API
    - Autocompletar dados ao digitar título
    - Buscar capas automaticamente

- **Séries de Livros**
    - Agrupar livros de uma série
    - Ordem de leitura
    - Progresso na série

---

### 🔐 **Segurança e Performance**
#### **Alta Prioridade**


- **Autenticação de Usuário**
    - Login/registro
    - JWT tokens
    - Cada usuário vê apenas seus livros

- **Rate Limiting**
    - Limitar requisições por IP
    - Prevenir spam/abuso
    - Biblioteca: express-rate-limit

- **Validação de Dados**
    - Validação no backend (Joi, Zod)
    - Validação no frontend (VeeValidate)
    - Mensagens de erro claras

- **HTTPS**
    - Certificado SSL em produção
    - Redirecionar HTTP → HTTPS
    - Secure cookies

#### Média Prioridade
- **Otimização de Imagens**
    - Comprimir capas automaticamente
    - Servir WebP quando suportado
    - Lazy loading de imagens

- **Service Worker**
    - PWA (Progressive Web App)
    - Funcionar offline
    - Cache de assets

- **Logging e Monitoramento**
    - Logs estruturados (Winston)
    - Monitorar erros (Sentry)
    - Métricas de performance

- **Testes**
    - Testes unitários (Vitest)
    - Testes de integração (Cypress)
    - Testes E2E

---


### 🗄️ **Backend e Infraestrutura**
#### Alta Prioridade
- **Paginação do Notion Otimizada**
    - Usar cursor pagination do Notion
    - Não carregar todos os livros de uma vez
    - Buscar apenas página necessária

- **Cache Redis**
    - Substituir cache em memória por Redis
    - Cache persistente entre restarts
    - Compartilhado entre instâncias

- **Filas de Processamento**
    - Bull/BullMQ para tarefas assíncronas
    - Importação em background
    - Envio de emails

- **Deploy Automatizado**
    - CI/CD (GitHub Actions)
    - Deploy no Vercel (frontend)
    - Deploy no Railway/Render (backend)

#### Média Prioridade
- **Webhook do Notion**
    - Sincronizar mudanças em tempo real
    - Invalidar cache quando Notion muda
    - Atualizar frontend automaticamente

- **GraphQL API**
    - Alternativa à REST
    - Cliente escolhe campos que quer
    - Menos requisições

- **Versionamento de API**
    - /api/v1/books
    - /api/v2/books
    - Manter compatibilidade

- **Docker**
    - Dockerfile para backend
    - Dockerfile para frontend
    - docker-compose.yml

---

### 📱 **Mobile e Acessibilidade**

#### Alta Prioridade
- **Responsividade Avançada**
    - Otimizar para tablets
    - Menu hamburguer no mobile
    - Bottom navigation mobile

- **Acessibilidade (A11y)**
    - ARIA labels corretos
    - Navegação por teclado
    - Alto contraste

- **PWA Completo**
    - Instalar no celular
    - Ícone na home screen
    - Splash screen


---

### 🎓 **Recursos Sociais**

#### Baixa Prioridade (Features Avançadas)


- **Recomendações**
    - IA para sugerir próxima leitura
    - Baseado em gostos similares
    - "Usuários que leram X também leram Y"

- **Clube do Livro**
    - Criar grupos de leitura
    - Chat/comentários por livro
    - Calendário de encontros

- **Integração Social**
    - GoodReads sync

---# biblioteca-notion__frontend
