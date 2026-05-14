import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SubjectView from '../views/SubjectView.vue'
import DocView from '../views/DocView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/subject/:subject',
    name: 'subject',
    component: SubjectView,
    props: true
  },
  {
    path: '/doc/:subject/:category/:doc',
    name: 'doc',
    component: DocView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
