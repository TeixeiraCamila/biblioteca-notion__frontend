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

### Estrutura de Componentes

A aplicação segue uma arquitetura baseada em camadas para melhor organização e escalabilidade:

```
src/
├── components/          # Componentes Vue reutilizáveis
│   ├── ui/             # Componentes de UI genéricos
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   ├── Modal.vue
│   │   ├── Card.vue
│   │   ├── Badge.vue
│   │   └── Skeleton/
│   │       ├── BookCardSkeleton.vue
│   │       └── FormSkeleton.vue
│   │
│   ├── forms/          # Componentes de formulário
│   │   ├── FormField.vue
│   │   ├── FormSection.vue
│   │   ├── FormActions.vue
│   │   └── BookForm/
│   │       ├── BookForm.vue
│   │       ├── BasicInfoSection.vue
│   │       ├── StatusSection.vue
│   │       ├── PublicationSection.vue
│   │       └── MetadataSection.vue
│   │
│   ├── books/          # Componentes específicos de livros
│   │   ├── BookCard/
│   │   │   ├── BookCard.vue
│   │   │   ├── CardFront.vue
│   │   │   ├── CardBack.vue
│   │   │   └── CardStatus.vue
│   │   ├── BookList/
│   │   │   ├── BookList.vue
│   │   │   └── BookGrid.vue
│   │   ├── BookDetails/
│   │   │   ├── BookDetails.vue
│   │   │   └── BookInfo.vue
│   │   └── ReadingProgress/
│   │       ├── ReadingProgress.vue
│   │       └── ProgressChart.vue
│   │
│   ├── layout/         # Componentes de layout
│   │   ├── Header.vue
│   │   ├── Sidebar.vue
│   │   ├── Layout.vue
│   │   └── Container.vue
│   │
│   ├── navigation/     # Componentes de navegação
│   │   ├── Pagination.vue
│   │   ├── Filters.vue
│   │   └── SearchBar.vue
│   │
│   ├── feedback/       # Componentes de feedback
│   │   ├── Notification.vue
│   │   ├── ToastContainer.vue
│   │   └── ConfirmDialog.vue
│   │
│   └── features/       # Componentes de features específicas
│       ├── Stack/
│       │   ├── CardStackView.vue
│       │   └── CardIntro.vue
│       ├── TBRList/
│       │   └── TBRList.vue
│       └── ReadingList/
│           └── ReadingList.vue
│
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

### Camadas de Componentes

#### 1. **UI Components (src/components/ui/)**
Componentes genéricos e reutilizáveis que não possuem lógica de negócio específica.

**Princípios:**
- Puros e sem estado interno
- Props para configuração
- Estilização baseada em CSS-in-JS ou classes CSS
- Acessíveis (ARIA attributes)

**Exemplos:**
```vue
<!-- Button.vue -->
<template>
  <button 
    :class="['btn', `btn--${variant}`, { 'btn--disabled': disabled }]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  disabled: { type: Boolean, default: false }
})
defineEmits(['click'])
</script>
```

#### 2. **Form Components (src/components/forms/)**
Componentes especializados para formulários com validação e feedback visual.

**Princípios:**
- Validação integrada
- Feedback visual para erros
- Integração com sistemas de formulário
- Acessibilidade avançada

**Exemplos:**
```vue
<!-- FormField.vue -->
<template>
  <div class="form-field">
    <label v-if="label" :for="id">{{ label }}</label>
    <input 
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :class="{ 'has-error': error }"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>
```

#### 3. **Feature Components (src/components/features/)**
Componentes que representam funcionalidades completas da aplicação.

**Princípios:**
- Auto-contidos
- Gerenciam seu próprio estado quando necessário
- Comunicação através de eventos
- Testáveis isoladamente

**Exemplos:**
```vue
<!-- BookList.vue -->
<template>
  <div class="book-list">
    <Filters @filter="handleFilter" />
    <BookGrid :books="books" @edit="openEditModal" />
    <Pagination 
      :has-next="hasNextPage" 
      :has-previous="hasPreviousPage"
      @next="loadNextPage"
      @previous="loadPreviousPage"
    />
  </div>
</template>
```

#### 4. **Layout Components (src/components/layout/)**
Componentes que definem a estrutura visual da aplicação.

**Princípios:**
- Não possuem lógica de negócio
- Focados em organização visual
- Flexíveis para diferentes conteúdos
- Responsivos por padrão

### Guidelines para Criação de Novos Componentes

#### 1. **Decisão de Estrutura**
Antes de criar um componente, decida a estrutura adequada:

**Componente Simples (arquivo único):**
- Menos de 100 linhas
- Lógica simples
- Uso limitado

**Componente Complexo (sub-pasta):**
- Mais de 100 linhas
- Lógica complexa
- Múltiplas variações
- Uso extensivo

#### 2. **Padrões de Nomeação**
- **Arquivos**: PascalCase (ex: `BookCard.vue`)
- **Pastas**: PascalCase (ex: `BookCard/`)
- **Componentes**: PascalCase
- **Variáveis**: camelCase
- **Classes CSS**: kebab-case

#### 3. **Estrutura de Arquivos**
Para componentes complexos, siga este padrão:

```
ComponentName/
├── ComponentName.vue        # Componente principal
├── ComponentName.types.ts   # Tipos TypeScript (se aplicável)
├── ComponentName.stories.ts # Stories para Storybook (se aplicável)
├── ComponentName.test.ts    # Testes unitários
└── __tests__/               # Testes de integração
    └── ComponentName.spec.ts
```

#### 4. **Boas Práticas de Desenvolvimento**

**Props:**
```vue
<script setup>
// Sempre defina tipos e valores padrão
const props = defineProps({
  title: {
    type: String,
    required: true,
    validator: (value) => value.length > 0
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>
```

**Eventos:**
```vue
<script setup>
// Defina eventos claramente
const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

// Use eventos para comunicação
const handleSubmit = () => {
  emit('submit', formData)
}
</script>
```

**Slots:**
```vue
<template>
  <div class="card">
    <header v-if="$slots.header">
      <slot name="header"></slot>
    </header>
    
    <main>
      <slot></slot>
    </main>
    
    <footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

#### 5. **Estilização**
- Use scoped styles sempre que possível
- Prefira CSS-in-JS para componentes pequenos
- Use arquivos CSS separados para estilos complexos
- Mantenha consistência com o design system

```vue
<style scoped>
.component-name {
  /* Estilos do componente */
}

.component-name__element {
  /* Elementos específicos */
}

/* Responsividade */
@media (max-width: 768px) {
  .component-name {
    /* Estilos mobile */
  }
}
</style>
```

#### 6. **Acessibilidade**
- Sempre inclua atributos ARIA quando necessário
- Use labels para inputs
- Implemente navegação por teclado
- Teste com leitores de tela

```vue
<template>
  <button 
    :aria-label="ariaLabel"
    :aria-expanded="isOpen"
    @keydown.escape="close"
  >
    {{ label }}
  </button>
</template>
```

#### 7. **Performance**
- Use `v-memo` para listas grandes
- Implemente lazy loading para imagens
- Evite computações pesadas no template
- Use `computed` para cálculos complexos

```vue
<script setup>
// Computações pesadas devem ser computed
const expensiveComputation = computed(() => {
  return items.value.filter(item => item.active)
    .map(item => ({ ...item, computed: true }))
})
</script>
```

#### 8. **Testes**
Todo componente deve ter:
- Testes unitários para lógica de negócios
- Testes de integração para fluxos completos
- Testes de acessibilidade
- Testes de responsividade

```javascript
// ComponentName.test.ts
import { mount } from '@vue/test-utils'
import ComponentName from './ComponentName.vue'

describe('ComponentName', () => {
  it('should render correctly', () => {
    const wrapper = mount(ComponentName, {
      props: { title: 'Test' }
    })
    expect(wrapper.text()).toContain('Test')
  })
})
```

#### 9. **Documentação**
Cada componente deve incluir:
- Comentário de documentação no topo
- Exemplos de uso
- Descrição de props e eventos
- Notas sobre acessibilidade

```vue
<script setup>
/**
 * Componente de cartão de livro
 * 
 * @description Exibe informações de um livro com animações e interações
 * @example
 * <BookCard :book="book" @edit="handleEdit" />
 * 
 * @props
 * - book: Object (required) - Dados do livro
 * - editable: Boolean (optional) - Permite edição
 * 
 * @events
 * - edit: Emitted when edit button is clicked
 * - delete: Emitted when delete button is clicked
 */
</script>
```

#### 10. **Integração com Stores**
- Use stores para estado global
- Evite props drilling
- Comunique-se através de eventos quando necessário

```vue
<script setup>
import { useBookStore } from '@/stores/bookStore'

const bookStore = useBookStore()

const handleDelete = async () => {
  await bookStore.deleteBook(props.book.id)
  emit('deleted', props.book.id)
}
</script>
```

### Fluxo de Criação de Componentes

1. **Análise**: Identifique a necessidade e o escopo do componente
2. **Planejamento**: Defina props, eventos e slots necessários
3. **Criação**: Implemente o componente seguindo os padrões
4. **Testes**: Crie testes unitários e de integração
5. **Documentação**: Adicione documentação e exemplos
6. **Review**: Revise o código e os testes
7. **Deploy**: Integre ao fluxo de desenvolvimento

### Ferramentas Recomendadas

- **ESLint**: Para manter a qualidade do código
- **Prettier**: Para formatação consistente
- **TypeScript**: Para tipagem e segurança
- **Storybook**: Para documentação visual de componentes
- **Vitest**: Para testes unitários
- **Cypress**: Para testes end-to-end

Esta estrutura e estes guidelines garantem que a aplicação seja escalável, manutenível e de alta qualidade.

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