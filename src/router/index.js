import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/pages/HomePage'
import DashboardPage from '@/pages/DashboardPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/dashboard',
      name: 'DashboardPage',
      component: DashboardPage
    }
  ]
})
