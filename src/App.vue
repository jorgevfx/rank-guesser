<script setup>
  import VALORANT_RANKS from "@/utils/constants";
  import RankButton from "@/components/RankButton.vue";
  import { computed, ref } from "vue";
  import ResultsModal from "@/components/ResultsModal.vue";

  const showModal = ref(false);
  const selectedRank = ref("");
  const selectedButton = ref(null);

  const getSubRanks = computed(() => {
    for(const key in VALORANT_RANKS){
      if(key === selectedRank.value){
        return VALORANT_RANKS[key].subRanks ;
      }
    }
    return [];
  })

  const toggleModal = () => {
    showModal.value = !showModal.value;
  };

  const handleSelectedRank = (rank, buttonRef) => {
    // conditionally remove selected class from button, so that only one button can be selected at a time
    if (selectedButton.value) {
      selectedButton.value.classList.remove("selected");
    }
    selectedRank.value = rank;
    selectedButton.value = buttonRef;
  };

</script>

<template>
  <teleport to=".modals">
    <ResultsModal :show="showModal"/>
  </teleport>
  <header>
    <div class="logo">
      <img src="/logo.png" alt="logo">
    </div>
  </header>
  <main class="main">
    <div class="video__container">
      <img src="./assets/valo_video.png" alt="test">
    </div>
    <div class="rank__buttons">
      <RankButton
          v-for="rank in Object.keys(VALORANT_RANKS)"
          :key="rank"
          :rank="rank"
          @selected-rank="handleSelectedRank"
      />
    </div>
    <TransitionGroup name="list" tag="ul" class="subranks__list">
      <li v-for="subRank in getSubRanks" :key="subRank" class="subrank__item">
        <img :src="`/ranks/${subRank}.png`" :alt="subRank" @click="toggleModal">
      </li>
    </TransitionGroup>
  </main>
</template>

<style>
.logo {
  width: 100%;
  height: 50px;
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 1.5rem 0;
}

.video__container {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  max-width: 1000px;
  max-height: 450px;
}

.video__container img {
  width: 100%;
  object-fit: contain;
}

.rank__buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.subranks__list {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin: 0 auto;
  width: 100%;
  max-width: 1000px;
}

.subrank__item {
  width: clamp(100px, 20vw, 130px);
  height: clamp(100px, 20vw, 130px);
}

.subrank__item img {
  width: 100%;
  object-fit: contain;
  cursor: pointer;
}

/* Animation properties for TransitionGroup */
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>