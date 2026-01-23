<script setup>
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const showHeader = computed(() => {
  return !route.meta.hideHeader
});
</script>

<template>
  <div class="app__view" :class="{ 'app__view--login': !showHeader }">
    <main class="app__main-content" :class="{ 'app__main-content--login': !showHeader }">
      <router-view v-slot="{ Component, route }">
        <transition name="page-turn" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
.app__main-content,
.app__main-content--login {
  padding: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Page-turn animation */
.page-turn-enter-active,
.page-turn-leave-active {
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left center;
  transform-style: preserve-3d;
}

.page-turn-enter-from {
  transform: rotateY(-90deg) translateZ(100px);
  opacity: 0;
}

.page-turn-enter-to {
  transform: rotateY(0deg) translateZ(0px);
  opacity: 1;
}

.page-turn-leave-from {
  transform: rotateY(0deg) translateZ(0px);
  opacity: 1;
}

.page-turn-leave-to {
  transform: rotateY(90deg) translateZ(-100px);
  opacity: 0;
}
</style>
