<script setup>
import ValorantLogo from "@/components/icons/ValorantLogo.vue";
import {reactive} from "vue";
import {gsap} from "gsap";
import {useMutation} from "@tanstack/vue-query";
import {guessClip} from "@/services/clipService";
import {resetCachedClips} from "@/services/clipLogic";
import {toast} from "vue-sonner";
import Spinner from "@/components/icons/Spinner.vue";

const emit = defineEmits(['closeModal'])
const props = defineProps({
  show: Boolean,
  guessedRank: String,
  clipId: String
})
const results = reactive({
  points: 0,
  guessedRank: "",
  actualRank: ""
})
const earnPoints = reactive({
  value: 0
})

const {mutate, isSuccess, isLoading, reset} = useMutation({
  mutationFn: guessClip,
  onSuccess: ({guessedRank, actualRank, points}) => {
    results.guessedRank = guessedRank;
    results.actualRank = actualRank;
    results.points = points;
  },
  onError: ({response}) => {
    if(response?.status===404){
      toast.error("Your progress will be reset because you have outdated clips")
      setTimeout(() => {
        resetCachedClips();
        window.location.reload();
      }, 2000)
    } else {
      toast.error(response?.data?.message || "Something went wrong")
      handleModalClose();
    }
  }
})

const onModalEnter = () => {
  mutate({
    clipId: props.clipId,
    subRank: props.guessedRank
  });
};

const afterModalEnter = () => {
  gsap.to(earnPoints, {
    value: results.points,
    duration: 0.5,
    onUpdate: () => {
      earnPoints.value = Math.round(earnPoints.value);
    }
  });
}

const handleModalClose = () => {
  results.guessedRank = "";
  results.actualRank = "";
  emit("closeModal", isSuccess.value, results.points);
  results.points = 0;
  earnPoints.value = 0;
  reset();
}
</script>

<template>
  <Transition name="backdrop" @after-enter="onModalEnter">
    <div class="backdrop" v-if="props.show">
      <Spinner v-if="isLoading"/>
    </div>
  </Transition>
  <Transition name="modal" @after-enter="afterModalEnter">
    <div class="modal__wrapper valorant-font" v-if="isSuccess && props.show">
      <div class="results__modal">
        <div class="top">
          <h1 class="valorant-font">Results</h1>
        </div>
        <div class="content">
          <div class="score">
            <ValorantLogo/>
            <h1 class="valorant-font"> {{ earnPoints.value }} </h1>
          </div>
          <div class="ranks">
            <div class="guessed__rank rank">
              <h2 class="valorant-font">Guessed Rank</h2>
              <div class="rank__image">
                <img :src="`/ranks/${results.guessedRank}.png`" :alt="results.guessedRank"/>
              </div>
            </div>
            <div class="actual__rank rank">
              <h2 class="valorant-font">Actual Rank</h2>
              <div class="rank__image">
                <img :src="`/ranks/${results.actualRank}.png`" :alt="results.actualRank"/>
              </div>
            </div>
          </div>
          <div class="next">
            <span class="valorant-font" @click="handleModalClose()">Next ></span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.backdrop {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  width: 100%;
  height: 100%;
  background-color: rgba(27, 27, 27, 0.32);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;
  transition: opacity 300ms ease-in-out;
}

.modal__wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 300ms ease-in-out;
}

.results__modal {
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 800px;
  border-radius: 50px;
  background: var(--color-bg-modal-1);
  background: linear-gradient(
      180deg,
      var(--color-bg-modal-1),
      var(--color-bg-modal-2)
  );
  z-index: 100;
  transition: opacity 250ms 700ms ease;
}

.top {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-bg-modal-top);
  border-radius: 50px 50px 0 0;
  overflow: hidden;
}

.top h1 {
  padding: clamp(1rem, 5vw, 2rem);
  font-size: clamp(36px, 5vw, 54px);
  letter-spacing: 0.1em;
}

.content {
  display: flex;
  flex-direction: column;
  padding: .5rem;
  height: 100%;
  overflow: hidden;
}

.score {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.score h1 {
  font-size: clamp(70px, 10vw, 100px);
  margin-top: 10px;
}

.ranks {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex: 1;
}

.rank {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 1rem;
}

.rank h2 {
  font-size: clamp(22px, 5vw, 32px);
  letter-spacing: 0.1em;
  word-break-wrap: break-word;
  text-align: center;
}

.rank div {
  width: 100%;
  height: 100%;
  min-height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rank img {
  width: 42%;
  min-width: 80px;
  object-fit: contain;
}

.next {
  width: 100%;
  padding: .5rem 1rem;
  display: flex;
  justify-content: flex-end;
}

.next span {
  cursor: pointer;
}

//Animations
.backdrop-enter-active, .backdrop-leave-active {
  transition: all 300ms ease-in-out;
}

.backdrop-leave-active {
  transition-delay: 250ms;
}

.backdrop-enter-from, .backdrop-leave-to {
  opacity: 0;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

@media screen and (max-width: 768px) {
  .results__modal {
    border-radius: 30px;
  }

  .top {
    border-radius: 30px 30px 0 0;
  }
}
</style>