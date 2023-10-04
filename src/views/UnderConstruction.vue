<script setup>

import ConstructionCrane from "@/components/icons/ConstructionCrane.vue";
</script>

<template>
  <div class="container">
    <ConstructionCrane/>
    <h1>Page under construction</h1>
  </div>

</template>

<style scoped>
  .container {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .container h1 {
    font-family: Poppins, sans-serif !important;
    text-align: center;
    font-weight: 700;
    font-size: clamp(36px, 5vw, 48px);
  }
</style>