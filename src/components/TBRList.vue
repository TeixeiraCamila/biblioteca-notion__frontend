<script setup>
import { onMounted } from 'vue'
import { useBookStore } from '@/stores/bookStore'

const bookStore = useBookStore()

onMounted(() => {
  bookStore.fetchTbrBooks()
});

</script>

<template>
  <div class="scrapbook-container">
    <header class="scrapbook-header">
      <h1 class="scrapbook-title">To be read list</h1>
      <div class="scrapbook-tape"></div>
      <p class="scrapbook-subtitle">{{ bookStore.tbrCount }} livros para ler</p>
    </header>

    <div v-if="bookStore.loadingTbr" class="scrapbook-status">
      <p>Organizando...</p>
    </div>

    <div v-else-if="bookStore.tbrBooksList.length === 0" class="scrapbook-status">
      <p>Seu scrapbook está vazio. Adicione livros com status "To be read"!</p>
    </div>

    <div v-else class="scrapbook-grid">
      <div v-for="(book, index) in bookStore.tbrBooksList" :key="book.id" class="stamp-wrapper"
        :style="{ transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)` }">
        <div class="stamp">
          <div class="stamp-inner">
            <div class="stamp-image-container">
              <img v-if="book.cover?.[0]" :src="book.cover[0]" :alt="book.name" class="stamp-image" />
              <div v-else class="stamp-placeholder">📖</div>
              <div class="stamp-overlay"></div>
            </div>
            <div class="stamp-details">
              <h3 class="stamp-title">{{ book.name }}</h3>
              <p class="stamp-author">{{ book.author?.join(', ') }}</p>
            </div>
          </div>
          <div class="stamp-perforation"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


.scrapbook-header {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.scrapbook-title {
  font-size: 2.5rem;
  color: #4a3f35;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: #fdf6e3;
  padding: 0.5rem 2rem;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.scrapbook-tape {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 30px;
  background: rgba(210, 180, 140, 0.4);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
}

.scrapbook-subtitle {
  color: #8c7b6a;
  font-style: italic;
}

.scrapbook-status {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 4rem;
}

.scrapbook-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.stamp-wrapper {
  transition: all 0.3s ease;
  filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2));
}

.stamp-wrapper:hover {
  transform: scale(1.1) rotate(0deg) !important;
  z-index: 10;
}

.stamp {
  background: #fff;
  padding: 12px;
  position: relative;
  width: 180px;
  margin: 0 auto;
}

/* Efeito de borda serrilhada de selo */
.stamp::after {
  content: '';
  position: absolute;
  top: -12px;
  left: -8px;
  right: -12px;
  bottom: -9px;
  background-image: radial-gradient(circle at 9px 9px, transparent 6px, #fff 7px);
  background-size: 20px 20px;
  z-index: -1;
}

.stamp-inner {
  border: 1px solid #ddd;
  padding: 4px;
  background: #f9f9f9;
}

.stamp-image-container {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: #eee;
}

.stamp-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.2) contrast(1.1);
}

.stamp-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 3rem;
  background: #e5e5e5;
}

.stamp-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  pointer-events: none;
}

.stamp-details {
  padding: 10px 2px;
  text-align: center;
}

.stamp-title {
  font-size: 0.85rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stamp-author {
  font-size: 0.7rem;
  color: #777;
  margin: 4px 0 0 0;
}

@media (max-width: 600px) {
  .scrapbook-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 2rem;
  }

  .stamp {
    width: 140px;
  }

  .stamp-image-container {
    height: 180px;
  }
}
</style>
