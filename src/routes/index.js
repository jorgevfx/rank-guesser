import Valorant from "@/views/Valorant.vue";
import {createRouter, createWebHistory} from "vue-router";
import UnderConstruction from "@/views/UnderConstruction.vue";

const routes = [
    {
        path: '/valorant',
        name: 'Valorant',
        component: Valorant,
        props: true
    },
    {
        path: '/:catchAll(.*)',
        name: 'UnderConstruction',
        component: UnderConstruction,
    }
];

const router = new createRouter({
    history: createWebHistory(),
    routes,
});

export default router;