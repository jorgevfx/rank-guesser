<script setup>
import VALORANT_RANKS from "@/utils/constants";
import RankButton from "@/components/RankButton.vue";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useQuery} from '@tanstack/vue-query'
import {
  areClipsCached,
  cacheClips,
  getCachedClips,
  getClips,
  getFirstNotSeenClip, getTotalSeenClips,
  setClipAsSeen, updateCachedClips
} from "@/services/clipService"
import ClipProgress from "@/components/ClipProgress.vue";
import ResultsModal from "@/components/ResultsModal.vue";

const clips = ref([])
const actualClip = reactive({
  value: {}
})
const guessedRank = reactive({
  value: ""
})
const showModal = ref(false)
const selectedRank = ref("");
const selectedButton = ref(null);
const seenClips = ref(0);

const {data, isLoading, isError} = useQuery({
  queryKey: ['clips'],
  queryFn: getClips,
  enabled: !areClipsCached(),
})

onMounted(() => {
  if (areClipsCached()) {
    clips.value = getCachedClips();
    actualClip.value = getFirstNotSeenClip(clips.value);
    seenClips.value = getTotalSeenClips(clips.value);
  } else {
    watch(data, (newData) => {
      cacheClips(newData);
      clips.value = getCachedClips();
      actualClip.value = getFirstNotSeenClip(clips.value);
      seenClips.value = getTotalSeenClips(clips.value);
    })
  }
});

const showResults = (subRank) => {
  guessedRank.value = subRank;
  showModal.value = true;
  // reset selected rank and button
  selectedRank.value = "";
  handleSelectedRank("", selectedButton.value)
};

const closeModal = (isError) => {
  showModal.value = false;
  if(!isError.value) {
    nextClip();
  }
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

const nextClip = () => {
  seenClips.value++;
  const updatedClips = setClipAsSeen(clips.value, actualClip.value["id"]);
  clips.value = updatedClips;
  updateCachedClips(updatedClips);
  actualClip.value = getFirstNotSeenClip(updatedClips);
};

const getSubRanks = computed(() => {
  for (const key in VALORANT_RANKS) {
    if (key === selectedRank.value) {
      return VALORANT_RANKS[key].subRanks;
    }
  }
  return [];
})

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
    <ResultsModal
        :clip-id="actualClip.value['id']"
        :guessed-rank="guessedRank.value"
        :show="showModal"
        @close-modal="closeModal"
    />
  </teleport>
  <ClipProgress :seen-clips="seenClips"/>
  <div style="max-width: 1280px" class="video__container">
    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
      <iframe :src="actualClip.value['youtube_url']"
              width="1280" height="720" allowfullscreen
              title="satelite_2kills.mp4"
              style="border:none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; height: 100%; max-width: 100%;">
      </iframe>
    </div>
  </div>
  <div class="rank__buttons">
    <RankButton
        v-for="rank in Object.keys(VALORANT_RANKS)"
        :key="rank"
        :rank="rank"
        :is-disabled="areClipsCached() ? false : isLoading || isError"
        @selected-rank="handleSelectedRank"
    />
  </div>
  <TransitionGroup name="list" tag="ul" class="subranks__list">
    <li v-for="subRank in getSubRanks" :key="subRank" class="subrank__item">
      <img :src="`/ranks/${subRank}.png`" :alt="subRank" @click="showResults(subRank)">
    </li>
  </TransitionGroup>
</template>

<style>
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
  width: clamp(84px, 20vw, 130px);
  height: clamp(84px, 20vw, 130px);
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

@media screen and (max-width: 768px) {
  .subranks__list {
    gap: 12px;
  }

  .rank__buttons {
    gap: 8px;
  }
}
</style>