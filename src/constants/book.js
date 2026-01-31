/**
 * Constantes relacionadas a livros
 */

//  Status dos livros como array para uso em selects
export const BOOK_STATUS = ['To be read', 'Reading', 'Read', 'DNF']

// Objeto para mapeamento interno (se necessário)
export const BOOK_STATUS_MAP = {
  TO_READ: 'To be read',
  READING: 'Reading',
  READ: 'Read',
  DNF: 'DNF',
}

// Avaliações possíveis
export const BOOK_RATES = {
  HEART: '❤',
  STARS_5: '⭐⭐⭐⭐⭐',
  STARS_4: '⭐⭐⭐⭐',
  STARS_3: '⭐⭐⭐',
  STARS_2: '⭐⭐',
  STARS_1: '⭐',
}

// Mapeamento para exibição em português (se necessário)
export const BOOK_STATUS_LABELS = {
  'To be read': 'Para Ler',
  Reading: 'Lendo',
  Read: 'Completo',
  DNF: 'Abandonado',
}

// Labels de avaliação
export const BOOK_RATE_LABELS = {
  '❤': 'Favorito ❤',
  '⭐⭐⭐⭐⭐': '5 Estrelas ⭐⭐⭐⭐⭐',
  '⭐⭐⭐⭐': '4 Estrelas ⭐⭐⭐⭐',
  '⭐⭐⭐': '3 Estrelas ⭐⭐⭐',
  '⭐⭐': '2 Estrelas ⭐⭐',
  '⭐': '1 Estrela ⭐',
}
