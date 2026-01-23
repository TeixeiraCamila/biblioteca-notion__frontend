<script setup>
const props = defineProps({
  bookStatus: { type: Object, required: true },
  rotate: { type: String, required: false },
});
</script>

<template>
  <div class="card-status__tape" :style="{ transform: rotate }">
    <p class="card-status__text">{{ bookStatus }}</p>
    <img width="150" src="../../assets/images/tape.png" alt="" />
  </div>
</template>

<style scoped>
.card-status__tape {
  position: absolute;
  top: -31px;
  left: 11%;
  transform: rotate(-40deg);
}

.card-status__tape .card-status__text {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-40%, -50%);
}
</style>

<style>
.card-front .card-status__tape {
  transform: unset;
}

.card-back .card-status__tape .card-status__text {
  display: none;
}
</style>
