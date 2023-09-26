import Home from "@/views/Home.vue";
import Valorant from "@/views/Valorant.vue";
import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/valorant',
        name: 'Valorant',
        component: Valorant,
        props: true
    }
];

const router = new createRouter({
    history: createWebHistory(),
    routes,
});

export default router;