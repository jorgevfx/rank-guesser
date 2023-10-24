<script setup>
import {Vue3Lottie} from 'vue3-lottie';
import TrophyJSON from '@/assets/lotties/TrophyJSON.json';
import DoneJSON from '@/assets/lotties/DoneJSON.json';
import MarkJSON from '@/assets/lotties/MarkJSON.json';
import LikeJSON from '@/assets/lotties/LikeJSON.json';
import SilverMedalJSON from '@/assets/lotties/SilverMedalJSON.json';
import {computed, onMounted, ref} from "vue";

const {points} = defineProps({
  points: Number
})

const show = ref(false)

onMounted(async () => {
  points === 1000 ? await wait(1200) : await wait(1650)
  show.value = true
})

const animationName = computed(() => {
  if (points >= 0 && points <= 200) return MarkJSON
  else if (points > 200 && points <= 500) return LikeJSON
  else if (points > 500 && points <= 750) return DoneJSON
  else if (points > 750 && points <= 950) return SilverMedalJSON
  else if (points > 950 && points <= 1000) return TrophyJSON
})

const computedGreetings = computed(() => {
  if (points === 1000) return "Just perfect!";
  else if (points >= 800) return "Well done";
  else if (points >= 600) return "Good job";
  else if (points >= 400) return "Not bad";
  else if (points >= 200) return "You can do better";
  else return "You can do better";
})

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

</script>

<template>
  <div class="results__container">
    <div class="left">
      <h1>SCORE</h1>
    </div>
    <div class="right">
      <Vue3Lottie
          :animationData="animationName"
          width="unset"
          height="30dvh"
          :delay="500"
          :loop="1"
      />
      <Transition name="bounce">
        <div class="greeting valorant-font" v-show="show">{{ computedGreetings }}</div>
      </Transition>
      <Transition name="slide">
      <div class="score-wrapper" v-show="show">
        <p class="valorant-font">Total <br> points</p>
        <p class="valorant-font">{{ points }}</p>
      </div>
      </Transition>
    </div>
  </div>
</template>

<style>
.results__container {
  display: flex;
  gap: 2%;
  width: 100%;
  height: 100%;
  max-height: 80dvh;
}

.left, .right {
  background: rgb(38, 42, 46);
  background: linear-gradient(45deg, rgba(28, 34, 42, 1) 0%, rgba(38, 42, 46, 1) 100%);
}

.left {
  width: 10%;
  display: flex;
  justify-content: center;
  border-radius: 40px 0 0 40px;
}

.left h1 {
  font-size: clamp(24px, 5vw, 52px);
  font-weight: bold;
  text-align: center;
  height: 100%;
  writing-mode: vertical-lr;
  -webkit-writing-mode: vertical-lr;
  text-orientation: upright;
  letter-spacing: calc(1vw);
}

.right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 90%;
  padding: 1rem .5rem;
  border-radius: 0 40px 40px 0;
  overflow: hidden;
}

.right .greeting {
  font-size: clamp(38px, 10vw, 60px);
  padding: 0 1rem;
  text-align: center;
  color: #DCE4E5;
  width: 100%;
  height: auto
}

.score-wrapper {
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  gap: 20px;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
  background-color: #191d21;
  padding: 1rem;
}

.score-wrapper p:first-child {
  color: #C2C2C2;
  font-size: clamp(32px, 10vw, 40px);
}

.score-wrapper p:last-child {
  color: #E9E9E9;
  font-size: clamp(52px, 10vw, 120px);
  margin-top: 14px;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

.slide-enter-active {
  animation: slide-in 0.4s ease-in;
}

.slide-leave-active {
  animation: slide-in 0.4s reverse;
}

@keyframes slide-in {
  0% {
    transform: translateY(100%);
  }
  50% {
    transform: translateY(-10%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>