<script setup>
import {Toaster} from "vue-sonner";
</script>

<template>
  <Toaster theme="dark"/>
  <header>
    <div class="logo">
      <img src="/logo.png" alt="logo">
    </div>
  </header>
  <main class="main">
    <router-view/>
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
  max-width: 1020px;
  margin: 0 auto;
  position: relative;
}

@media screen and (max-width: 768px) {
  .main {
    gap: 24px;
  }
}
</style>