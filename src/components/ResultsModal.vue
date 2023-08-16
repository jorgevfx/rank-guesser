<script setup>
import ValorantLogo from "@/components/icons/ValorantLogo.vue";
const { show } = defineProps({
  show: Boolean
})
</script>

<template>
  <Transition name="fade">
    <div class="backdrop" v-if="show"></div>
  </Transition>
  <Transition name="slide" appear>
    <div class="modal__wrapper" v-if="show">
      <div class="results__modal">
        <div class="top">
          <h1>Results</h1>
        </div>
        <div class="content">
          <div class="score">
            <ValorantLogo />
            <h1>250</h1>
          </div>
          <div class="ranks">
            <div class="guessed__rank rank">
              <h2>Guessed Rank</h2>
              <img src="/ranks/Immortal_1.png" alt="immortal1"/>
            </div>
            <div class="actual__rank rank">
              <h2>Actual Rank</h2>
              <img src="/ranks/Ascendant_3.png" alt="ascendant3"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    width: 100%;
    height: 100%;
    background-color: rgba(27, 27, 27, 0.32);
    backdrop-filter: blur(10px);
    transition:  opacity 300ms ease-in-out;
  }

  .modal__wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .results__modal {
    position: fixed;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 800px;
    max-height: 500px;
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
  }

  .top h1 {
    padding: clamp(1.5rem, 5vw, 2rem);
    font-size: clamp(36px, 5vw, 54px);
    letter-spacing: 0.1em;
  }

  .content {
    display: flex;
    flex-direction: column;
    padding: .5rem;
    height: 100%;
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

  .rank img {
    width: 40%;
    min-width: 60px;
    object-fit: contain;
  }

  //Animations
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 250ms ease-in-out
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 250ms 500ms ease;
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: scale(0);
  }

  .slide-enter-from .results__modal,
  .slide-leave-to .results__modal {
    transform: scale(1.1);
  }


</style>