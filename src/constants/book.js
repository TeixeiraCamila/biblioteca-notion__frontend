/**
 * Constantes relacionadas a livros
 */

// Status dos livros
export const BOOK_STATUS = {
  TO_READ: 'To be read',
  READING: 'Reading',
  READ: 'Read'
}

// Avaliações possíveis
export const BOOK_RATES = {
  HEART: '❤',
  STARS_5: '⭐⭐⭐⭐⭐',
  STARS_4: '⭐⭐⭐⭐',
  STARS_3: '⭐⭐⭐⭐',
  STARS_2: '⭐⭐⭐',
  STARS_1: '⭐'
}

// Mapeamento para exibição em português
export const BOOK_STATUS_LABELS = {
  [BOOK_STATUS.TO_READ]: 'Para Ler',
  [BOOK_STATUS.READING]: 'Lendo',
  [BOOK_STATUS.READ]: 'Completo'
}

export const BOOK_RATE_LABELS = {
  [BOOK_RATES.HEART]: 'Favorito',
  [BOOK_RATES.STARS_5]: '⭐⭐⭐⭐⭐',
  [BOOK_RATES.STARS_4]: '⭐⭐⭐⭐',
  [BOOK_RATES.STARS_3]: '⭐⭐⭐',
  [BOOK_RATES.STARS_2]: '⭐⭐',
  [BOOK_RATES.STARS_1]: '⭐'
}
