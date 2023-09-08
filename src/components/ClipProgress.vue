<script setup>
  import {computed} from "vue";

  const { seenClips } = defineProps({
    seenClips: {
      type: Number,
      required: true
    },
  })

  const getProgressClassName = computed(() => ({
    "zero": seenClips === 0,
    "one": seenClips === 1,
    "two": seenClips === 2,
    "three": seenClips === 3,
    "four": seenClips === 4,
    "five": seenClips === 5,
  }))
</script>

<template>
  <div class="progress-box">
    <div class="progress-bar">
      <span class="progress-tooltip " :class="getProgressClassName">
          <span class="tooltip">{{seenClips}}</span>
      </span>
    </div>
<!--    <span class="title">Seen clips</span>-->
  </div>
</template>

<style>
.progress-box{
  width: 100%;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-box .title{
  font-size: clamp(12px, 1.5vw, 18px);
  color: #dedede;
  font-weight: 600;
}

.progress-box .progress-bar{
  height: 8px;
  width: 100%;
  border-radius: 6px;
  margin-top: 6px;
  background: rgba(255,255,255,.3)
}

.progress-bar .progress-tooltip{
  position: relative;
  display: block;
  height: 100%;
  border-radius: 6px;
  background: var(--tooltip);
  animation: progress 0.4s ease-in-out forwards;
  opacity: 0;
  animation-delay: 0.2s;
}

.progress-tooltip.zero{
  width: 0;
}

.progress-tooltip.one{
  width: 20%
}

.progress-tooltip.two{
  width: 40%
}

.progress-tooltip.three{
  width: 60%
}

.progress-tooltip.four{
  width: 80%
}

.progress-tooltip.five{
  width: 100%
}

@keyframes progress {
  0%{
    width: 0;
    opacity: 1;
  }
  100%{
    opacity: 1;
  }
}

.progress-tooltip .tooltip{
  position: absolute;
  right: -14px;
  top: -30px;
  font-size: clamp(12px, 1.5vw, 16px);
  font-weight: 500;
  color: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--tooltip);
  z-index: 1;
}

.tooltip::before{
  content: '';
  position: absolute;
  left: 50%;
  bottom: -2px;
  height: 10px;
  width: 10px;
  z-index: -1;
  background-color: var(--tooltip);
  transform: translateX(-50%) rotate(45deg);
}

</style>