<script setup>
import { ref, onMounted, } from 'vue'

import gsap from 'gsap'

const animatedElements = ref()

function anime() {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
  })

  const elements = animatedElements.value.querySelectorAll('p')

  tl.from(
    elements,
    {
      x: (index) => (index === 0 ? -60 : 60),
      opacity: 0,
      duration: 3,
      delay: 0.8,
      ease: 'back.out(1.7)',
      stagger: 0.1,
    },
    '-=1.2',
  )

  // Animate cloud from right to left
  tl.from(
    '.card-intro__cloud',
    {
      x: 100,
      opacity: 0,
      duration: 2,
      ease: 'power2.out',
    },
    '-=2.5',
  )

  // Animate start descending
  tl.from(
    '.card-intro__start',
    {
      y: -100,
      opacity: 0,
      duration: 2,
      ease: 'bounce.out',
    },
    '-=2',
  )

  // Animate coffee appearing
  tl.from(
    '.card-intro__coffee',
    {
      opacity: 0,
      scale: 0.5,
      duration: 1.5,
      ease: 'back.out(1.7)',
    },
    '-=1.5',
  )
};

onMounted(() => {
  anime()
});

</script>

<template>
  <div class="card-intro flex flex-center justify-center items-center">
    <div class="card-intro__detail">
      <img class="card-intro__detail-01" src="../../assets/images/cards/card_01_intro/bg-r_top.webp" alt="">
      <img class="card-intro__detail-02" src="../../assets/images/cards/card_01_intro/bg-r_bottom.webp" alt="">

      <img class="card-intro__detail-03" src="../../assets/images/cards/card_01_intro/paper-02.webp" alt="">

      <img class="card-intro__detail-04" src="../../assets/images/cards/card_01_intro/paper-06.webp" alt="">

      <img class="card-intro__detail-05" src="../../assets/images/cards/card_01_intro/paper-5.webp" alt="">
      <img class="card-intro__cloud" src="../../assets/images/cards/card_01_intro/cloude.webp" alt="">
      <img class="card-intro__start" src="../../assets/images/cards/card_01_intro/start.webp" alt="">
      <img class="card-intro__coffee" src="../../assets/images/cards/card_01_intro/coffee.webp" alt="">
    </div>
    <div class="card-intro__content">
      <img class="card-intro__content__image" src="../../assets/images/cards/card_01_intro/paper-01.webp" alt="">
      <img class="card-intro__content__detail" src="../../assets/images/cards/card_01_intro/luck.webp" alt="">
      <h1 ref="animatedElements" class="card-intro__title">
        <p>My Book</p>
        <p>Journal</p>
      </h1>




    </div>
  </div>
</template>



<style scoped>
.card-intro {
  background-color: #075832;
  /* position: relative; */
  overflow: hidden;
}

.card-intro__detail img {
  position: absolute;
}

.card-intro__detail-01 {
  top: 0;
  right: 0;
}

.card-intro__detail-02 {
  bottom: 0;
  right: 0;
}

.card-intro__detail-03 {
  bottom: 0;
  left: 0;
  z-index: 2;
}

.card-intro__detail-04 {
  bottom: 0;
  left: 5%;
  z-index: 1;
}

.card-intro__detail-05 {
  top: 0;
  left: 0;
  z-index: 3;
}

.card-intro__cloud {
  top: 20%;
  right: 0;
  z-index: 4;
}

.card-intro__start {
  top: -5%;
  right: 70%;
  z-index: 5;
}

.card-intro__coffee {
  bottom: 5%;
  left: 10%;
  z-index: 4;
}

.card-intro__content {
  position: absolute;
  z-index: 10;
  text-align: center;
  width: fit-content;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.card-intro__content__detail {
  position: absolute;
  top: 0;
  left: 0;
}

.card-intro__title {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  color: rgb(2, 2, 2);
  letter-spacing: -0.04em;
  font-size: 55px;
  z-index: 20;
}
</style>
