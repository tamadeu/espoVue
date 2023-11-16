import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import {loadLayoutMiddleware} from "./middleware/loadLayoutMiddleware";
import HomePage from '../views/HomePage.vue'
import EntityListingPage from '../views/EntityListingPage.vue'
import EntityShowPage from '../views/EntityShowPage.vue'
import EntityEditPage from '../views/EntityEditPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    meta: { layout: 'AppLayoutDefault'},
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    meta: { layout: 'AppLayoutDefault'},
    component: HomePage
  },
  {
    path: '/:entity',
    name: 'Entity.list',
    meta: { layout: 'AppLayoutDefault'},
    component: EntityListingPage
  },
  {
    path: '/:entity/:id',
    name: 'Entity.show',
    meta: { layout: 'AppLayoutDefault'},
    component: EntityShowPage
  },
  {
    path: '/:entity/:id/edit',
    name: 'Entity.edit',
    meta: { layout: 'AppLayoutDefault'},
    component: EntityEditPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(loadLayoutMiddleware)


export default router
