import { createRouter, createWebHistory } from 'vue-router'

// Определяем маршруты
const routes = [
    {
        path: '/',              // URL
        name: 'Home',
        component: () => import('../views/HomeView.vue') // ленивый импорт
    },
    {
        path: '/cartochki',
        name: 'Cartochki',
        component: () => import('../views/CartochkiView.vue')
    }
]

// Создаём роутер
const router = createRouter({
    history: createWebHistory(), // режим history (красивые URL)
    routes
})

export default router
