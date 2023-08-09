<script setup>
  import { ref } from "vue";

  const emit = defineEmits(['selected-rank']);
  const active = ref(false);

  const { rank } = defineProps({
    rank: {
      type: String,
      required: true
    }
  })

  const toggleSelected = () => {
    active.value = !active.value;
    emit('selected-rank', rank);
  }
</script>

<template>
  <div class="rank__button" :class="{ active }">
    <button type="button" @click="toggleSelected">{{ rank }}</button>
  </div>
</template>

<style>
  .rank__button {
    min-width: 100px;
    width: fit-content;
    height: 50px;
  }

  .rank__button button {
    width: 100%;
    height: 100%;
    font-size: clamp(16px, 1.5vw, 22px);
    padding: 0 14px;
    color: var(--color-text);
    border: 1px solid rgba(232,234,237, .4);
    border-radius: 20px;
    background-color: transparent;
    cursor: pointer;
    transition: all .1s ease-in-out;
  }

  .rank__button button:hover {
    background-color: var(--color-rank-button-hover);
    border-color: var(--color-rank-button-hover);
  }

  .rank__button button:active {
    transform: scale(.95);
  }
</style>