import Vue from 'vue';
import Router from 'vue-router';


import Homepage from '../components/Homepage.vue';
import Movies from '../components/Movies.vue';
import Actors from '../components/Actors.vue';
import Categories from '../components/Categories.vue';
import EditProfile from '../components/EditProfile.vue';
import LoginForm from '../components/LoginForm.vue';
import ForgotPassword from '../components/ForgotPassword.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Homepage', component: Homepage },
    { path: '/movies', name: 'Movies', component: Movies },
    { path: '/actors', name: 'Actors', component: Actors },
    { path: '/categories', name: 'Categories', component: Categories },
    { path: '/edit-profile', name: 'EditProfile', component: EditProfile },
    { path: '/login-form', name: 'LoginForm', component: LoginForm },
    { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword }
  ]
});
