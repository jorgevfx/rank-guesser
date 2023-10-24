import './assets/main.css'

import { createApp } from 'vue'
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from './App.vue'
import Vue3Lottie from 'vue3-lottie'
import router from "@/routes";

createApp(App)
    .use(VueQueryPlugin, {
        defaultConfig: {
        }
    })
    .use(router)
    .use(Vue3Lottie)
    .mount('#app')
