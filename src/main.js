// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods.vue';
import seller from './components/seller/seller.vue';
import ratings from './components/ratings/ratings.vue';
import Vuex from 'vuex';
import './common/stylus/index.styl';

Vue.config.debug = true;

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueResource);

const router = new VueRouter({
    linkActiveClass: 'active',
    routes: [
        {path: '/goods', component: goods},
        {path: '/seller', component: seller},
        {path: '/ratings', component: ratings}
    ]
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
}).$mount('#app');

router.push('/goods');
