<script setup>
import ValorantLogo from "@/components/icons/ValorantLogo.vue";
import {reactive} from "vue";
import {gsap} from "gsap";
import {useMutation} from "@tanstack/vue-query";
import {guessClip} from "@/services/clipService";
import {toast} from "vue-sonner";

const emit = defineEmits(['closeModal'])
const props = defineProps({
  show: Boolean,
  guessedRank: String,
  clipId: String
})

const results = reactive({
  guessedRank: "",
  actualRank: ""
})
const earnPoints = reactive({
  value: 0
})

const {isError, mutateAsync} = useMutation({
  mutationFn: guessClip,
  onSuccess: ({guessedRank, actualRank, points}) => {
    results.guessedRank = guessedRank;
    results.actualRank = actualRank;
    gsap.to(earnPoints, {
      value: points,
      duration: 0.5,
      onUpdate: () => {
        earnPoints.value = Math.round(earnPoints.value);
      }
    });
  },
  onError: ({response}) => {
    toast.error(response.data.message)
  }
})

const onModalEnter = async () => {
  // await mutateAsync({
  //   clipId: props.clipId,
  //   subRank: props.guessedRank
  // });
};

const handleModalClose = () => {
  earnPoints.value = 0;
  results.guessedRank = "";
  results.actualRank = "";
  emit("closeModal", isError);
}
</script>

<template>
  <Transition :duration="550" name="modal" @after-enter="onModalEnter">
    <div class="backdrop" v-if="props.show">
      <div class="modal__wrapper">
        <div class="results__modal">
          <div class="top">
            <h1>Results</h1>
          </div>
          <div class="content">
            <div class="score">
              <ValorantLogo/>
              <h1> {{ earnPoints.value }} </h1>
            </div>
            <div class="ranks">
              <div class="guessed__rank rank">
                <h2>Guessed Rank</h2>
                <Transition name="rank__image">
                  <img v-if="results.guessedRank!==''" :src="`/ranks/${results.guessedRank}.png`" :alt="results.guessedRank"/>
                </Transition>
              </div>
              <div class="actual__rank rank">
                <h2>Actual Rank</h2>
                <Transition name="rank__image">
                  <img v-if="results.guessedRank!==''" :src="`/ranks/${results.actualRank}.png`" :alt="results.actualRank"/>
                </Transition>

              </div>
            </div>
            <div class="next">
              <span @click="handleModalClose">Next ></span>
            </div>
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
  transition: height 300ms ease-in-out;
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

.rank img, .rank svg {
  width: 40%;
  min-width: 60px;
  object-fit: contain;
  transition: opacity 300ms ease-in-out;
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

.unknown__rank {

}

//Animations
.modal-enter-active, .modal-leave-active {
  transition: all 300ms ease-in-out;
}

.modal-leave-active {
  transition-delay: 250ms;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal__wrapper,
.modal-leave-active .modal__wrapper {
  transition: all 300ms ease-in-out;
}

.modal-enter-active .modal__wrapper {
  transition-delay: 250ms;
}

.modal-enter-from .modal__wrapper,
.modal-leave-to .modal__wrapper {
  opacity: 0;
  transform: scale(0.5);
}

.rank__image-enter-active {
  animation: bounce-in 0.5s;
}
.rank__image-leave-active {
  animation: bounce-in 0.5s reverse;
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

@media screen and (max-width: 768px) {
  .results__modal {
    border-radius: 30px;
  }

  .top {
    border-radius: 30px 30px 0 0;
  }
}
</style>