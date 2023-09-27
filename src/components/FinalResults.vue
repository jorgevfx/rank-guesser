<script setup>
import AnimatedCheck from "@/components/icons/AnimatedCheck.vue";
</script>

<template>
  <div class="results__container">
    <AnimatedCheck color="rgb(42 53 73)"/>
    <h1>Final Results</h1>
    <p>Thanks for playing! You've seen all the selected clips for today</p>
    <p>Next clips will be available tomorrow at 12:00 PM</p>
  </div>
</template>

<style>
  .results__container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .results__container h1, p{
    font-family: Poppins, sans-serif !important;
    text-align: center;
    color: #cbd7e6;
  }

  .results__container h1 {
    font-size: clamp(32px, 5vw, 38px);
    font-weight: 600;
    margin-bottom: 0.5em;
    letter-spacing: 2px;
  }

  .results__container p {
    font-size: clamp(14px, 5vw, 22px);
    font-weight: 200;
    margin-bottom: 0.5em;
  }
</style>