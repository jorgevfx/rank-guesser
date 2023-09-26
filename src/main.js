import './assets/main.css'

import { createApp } from 'vue'
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from './App.vue'
import router from "@/routes";

createApp(App)
    .use(VueQueryPlugin, {
        defaultConfig: {
        }
    })
    .use(router)
    .mount('#app')
