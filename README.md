# Biblioteca Notion

Um sistema de gerenciamento de biblioteca pessoal integrado com o Notion, desenvolvido com Vue.js 3, Pinia e Vite. A aplicação permite organizar sua coleção de livros, controlar o progresso de leitura e gerenciar sua lista de desejos (TBR - To Be Read).

![Vue.js](https://img.shields.io/badge/Vue.js-3.5.22-green?style=flat-square)
![Pinia](https://img.shields.io/badge/Pinia-3.0.3-blue?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-7.1.11-orange?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-ESM-blue?style=flat-square)

## 📖 Visão Geral

O Biblioteca Notion é uma aplicação web moderna que sincroniza seus dados de livros com o Notion, permitindo que você:

- **Gerencie sua coleção de livros** com status de leitura (Para Ler, Lendo, Completo, Abandonado)
- **Controle o progresso** de leitura com avaliações e notas
- **Organize sua lista TBR** (To Be Read) para planejar suas próximas leituras
- **Filtre e busque** livros por título, autor ou status
- **Interface animada** com transições suaves e design responsivo

## 🚀 Funcionalidades

### Principais Características

- **Gerenciamento Completo de Livros**: Cadastro, edição e exclusão de livros
- **Status de Leitura**: Controle o progresso com 4 estados diferentes
- **Avaliações**: Sistema de estrelas e favoritos para suas avaliações
- **Lista TBR**: Gerencie sua lista de livros para ler
- **Busca e Filtros**: Encontre livros rapidamente por diferentes critérios
- **Paginação**: Sistema de paginação baseado em cursor para grandes coleções
- **Interface Responsiva**: Design adaptável para diferentes dispositivos
- **Animações**: Transições suaves e efeitos visuais agradáveis

### Tecnologias Utilizadas

- **Frontend**: Vue.js 3 com Composition API
- **Gerenciamento de Estado**: Pinia
- **Roteamento**: Vue Router 4
- **Build Tool**: Vite
- **Estilização**: CSS puro com variáveis CSS
- **Animações**: GSAP (GreenSock Animation Platform)
- **UI Components**: Lucide Icons
- **Notificações**: Vue Toastification
- **HTTP Client**: Axios
- **Formulários**: Validação customizada

## 🛠️ Requisitos

- Node.js ^20.19.0 || >=22.12.0
- npm ou yarn

## 📦 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/TeixeiraCamila/biblioteca-notion__frontend.git
   cd biblioteca-notion__frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Abra no navegador:**
   Acesse `http://localhost:5173`

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes Vue reutilizáveis
│   ├── BookCard/       # Componentes de cartão de livro
│   ├── Stack/          # Componentes de pilha de cartões
│   ├── BookForm.vue    # Formulário de cadastro/edição
│   ├── BookList.vue    # Lista de livros
│   ├── Filters.vue     # Filtros e busca
│   └── ...
├── views/              # Páginas da aplicação
│   ├── HomeView.vue    # Página inicial
│   ├── CreateBookView.vue # Página de criação
│   ├── CardStackckView.vue # Visualização em pilha
│   └── LoginView.vue   # Página de login
├── stores/             # Stores do Pinia
│   ├── bookStore.js    # Gerenciamento de livros
│   └── userStore.js    # Gerenciamento de usuários
├── services/           # Camada de serviços/API
│   └── api.js          # Configuração do Axios
├── constants/          # Constantes e enums
│   └── book.js         # Constantes de livros
├── composables/        # Composables reutilizáveis
│   ├── useAnimatedModal.js
│   └── useNotifications.js
├── router/             # Configuração de rotas
│   └── index.js
├── utils/              # Utilitários
│   └── validation.js   # Validação de formulários
└── assets/             # Assets estáticos
    ├── css/            # Estilos CSS
    ├── images/         # Imagens e ícones
    └── main.css        # Estilos principais
```

## 🔧 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia o servidor de desenvolvimento

# Build
npm run build            # Cria build de produção
npm run preview          # Visualiza build localmente

# Qualidade de Código
npm run lint             # Executa ESLint com correção automática
npm run format           # Formata código com Prettier

# Deploy
npm run vercel-build     # Build para deploy no Vercel
```

## 📡 API Backend

Esta aplicação frontend se comunica com um backend que se integra ao Notion. Para funcionar corretamente, você precisará:

1. **Backend**: Configure o backend correspondente (não incluído neste repositório)
2. **Notion Integration**: Crie uma integração no Notion e obtenha as credenciais
3. **Database**: Configure a database de livros no Notion com os campos necessários

### Estrutura da Database no Notion

A database deve conter os seguintes campos:

- **Name**: Título do livro (Title)
- **Author**: Autor (Text)
- **Status**: Status de leitura (Select)
- **Rate**: Avaliação (Select)
- **Pages**: Páginas totais (Number)
- **Read Pages**: Páginas lidas (Number)
- **Cover**: Capa do livro (Files & media)
- **Notes**: Anotações (Text)
- **Start Date**: Data de início (Date)
- **End Date**: Data de término (Date)

## 🎨 Design e Estilo

- **Design System**: Variáveis CSS para cores, tipografia e espaçamentos
- **Responsividade**: Layout adaptável para mobile, tablet e desktop
- **Animações**: Transições suaves com GSAP
- **Acessibilidade**: Sempre que possível, utiliza-se atributos ARIA e boas práticas

## 🚀 Deploy

### Vercel

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente:
   - `VITE_API_URL`: URL do backend
3. O deploy será automático a cada push

### Outros Providers

A aplicação é compatível com qualquer provider que suporte SPA (Single Page Application).

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/nome-da-feature`
3. Faça commit das suas alterações: `git commit -m 'Adiciona nova feature'`
4. Dê push para a branch: `git push origin feature/nome-da-feature`
5. Abra um Pull Request

## 📋 Requisitos Futuros

- [ ] Estatísticas de leitura
- [ ] Importação/exportação de dados
- [ ] Modo offline
- [ ] Integração com APIs de livros (Google Books, Open Library)
- [ ] Dashboard de leitura
- [ ] Metas de leitura mensais/anuais
- [ ] Compartilhamento de livros
- [ ] Sistema de recomendações

## 🐛 Relatório de Bugs

Se encontrar algum bug, por favor abra uma issue no repositório com:

- Descrição do problema
- Passos para reproduzir
- Comportamento esperado
- Comportamento atual
- Informações do ambiente (browser, versão, etc.)

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- Vue.js Team pelo framework incrível
- Notion pela API poderosa
- Comunidade open source pelos excelentes pacotes

---

**Desenvolvido com ❤️ para amantes da leitura**