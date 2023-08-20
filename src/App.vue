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
    <div style="max-width: 1280px" class="video__container">
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe src="https://youtube.com/embed/BDTeH61_Fg0" width="1280" height="720" allowfullscreen title="satelite_2kills.mp4" style="border:none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; height: 100%; max-width: 100%;">
        </iframe>
      </div>
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
  position: relative;
  overflow: hidden;
}

.video__container {
  margin: 0 auto;
  width: 100%;
}

.video__container div {
  width: 100%;
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
  max-width: 1400px;
  min-height: 140px;
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
  transform: rotateX(180deg);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>