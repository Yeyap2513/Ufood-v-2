import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import Restaurant from "@/pages/restaurants/Restaurant.vue";
import User from "@/pages/user/User.vue";
import TestUser from "@/pages/user/TestUser.vue"; // Importer le nouveau TestUser
import TestModal from "@/pages/Test/TestModal.vue";
import Collection from "@/pages/collection/Collection.vue";
import Login from "@/pages/authentification/Login.vue";


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signin",
    name: "Login",
    component: Login,
  },
  {
    path: "/restaurant/:id",
    name: "Restaurant",
    component: Restaurant,
  },
  {
    path: "/user",
    name: "User",
    component: User,
  },
  {
    path: "/favorites/:id",
    name: "Favorite",
    component: Collection,
  },
  {
    path: "/test",
    name: "TestModal",
    component: TestModal,
  },
  
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
