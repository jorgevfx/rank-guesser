<script setup>
import VALORANT_RANKS from "@/utils/constants";
import RankButton from "@/components/RankButton.vue";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useQuery} from '@tanstack/vue-query'
import {
  areClipsCached,
  cacheClips,
  getCachedClips,
  getFirstNotSeenClip, getTotalPoints, getTotalSeenClips, resetGuesses,
  setClipAsSeen, updateCachedClips
} from "@/services/clipLogic"
import {getClips} from "@/services/clipService";
import ClipProgress from "@/components/ClipProgress.vue";
import ResultsModal from "@/components/ResultsModal.vue";
import FinalResults from "@/components/FinalResults.vue";
import {toast} from "vue-sonner";

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

const {data, isLoading, isError, error} = useQuery({
  queryKey: ['clips'],
  queryFn: getClips,
  enabled: !areClipsCached(),
})

watch(isError, (newIsError) => {
  if (newIsError) {
    toast.error(error.value.message)
  }
});

onMounted(() => {
  // Check if clips are cached
  if (areClipsCached()) {
    // If clips are cached, load them from cache
    clips.value = getCachedClips();
    // Get the first unseen clip from the cached data
    actualClip.value = getFirstNotSeenClip(clips.value);
    // Calculate the number of seen clips
    seenClips.value = getTotalSeenClips(clips.value);
  } else {
    // If there are no cached clips, watch for data updates
    watch(data, (newData) => {
      // Cache the newly loaded clips
      cacheClips(newData);
      // Update the clips variable with the newly cached clips
      clips.value = getCachedClips();
      // Get the first unseen clip from the newly cached data
      actualClip.value = getFirstNotSeenClip(clips.value);
      // Calculate the number of seen clips
      seenClips.value = getTotalSeenClips(clips.value);
    });
  }
});

const showResults = (subRank) => {
  guessedRank.value = subRank;
  showModal.value = true;
  // reset selected rank and button
  selectedRank.value = "";
  handleSelectedRank("", selectedButton.value)
};

const closeModal = (isSuccess, points) => {
  showModal.value = false;
  if(isSuccess) {
    nextClip(points);
  }
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

const nextClip = (points) => {
  seenClips.value++;
  if(seenClips.value<=5){
    updatePoints(points);
    const updatedClips = setClipAsSeen(clips.value, actualClip.value["id"]);
    clips.value = updatedClips;
    updateCachedClips(updatedClips);
    actualClip.value = getFirstNotSeenClip(updatedClips);
  }
};

const updatePoints = (points) => {
  clips.value = clips.value.map(clip => {
    if(clip["id"]===actualClip.value["id"]){
      clip["points"] = points;
    }
    return clip;
  })
}

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
        :clip-id="seenClips<5 ? actualClip.value['id'] : ''"
        :guessed-rank="guessedRank.value"
        :show="showModal"
        @close-modal="closeModal"
    />
  </teleport>
  <ClipProgress :seen-clips="seenClips" v-if="seenClips<5"/>
  <div class="wrapper" v-if="seenClips<5">
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
  </div>
  <FinalResults v-else :points="getTotalPoints(clips)"/>
</template>

<style>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
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