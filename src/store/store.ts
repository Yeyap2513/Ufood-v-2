// store/store.ts

import { reactive } from 'vue';
import { listeFavoritePoco } from '@/pocos/ListeFavoritePoco';
import { listUsers, getUserFavorites, getRestaurants } from '../api/api';
import { User } from './Users';  // Assurez-vous de mettre à jour le chemin vers le modèle User
import { router } from '@/router';

// Initialisation des données utilisateurs et restaurants
export const users = await listUsers();
const restaurantsList = await getRestaurants();

// Store réactif
export const store = reactive({
    users: users as User[],
    currentUser: null as User | null,
    restaurantsList: restaurantsList
});

// Fonction pour mettre à jour le localStorage avec les favoris de l'utilisateur
function updateFavorites() {
    if (store.currentUser) {
        store.currentUser.saveToLocalStorage();
    }
}

// Fonction de connexion de l'utilisateur
export async function loginUser(email: string): Promise<boolean> {
    const foundUser = store.users.find((u: User) => u.email === email);
    if (foundUser) {
        const userFavorites = await getUserFavorites(foundUser.id);
        store.currentUser = new User(foundUser.id, foundUser.email, foundUser.name, userFavorites);
        store.currentUser.saveToLocalStorage();
        return true;
    }
    return false;
}

// Initialisation de l'utilisateur depuis le localStorage
export function initializeUserFromLocalStorage() {
    const loadedUser = User.loadFromLocalStorage();
    if (loadedUser) {
        store.currentUser = loadedUser;
    }
}
initializeUserFromLocalStorage();

// Fonction de déconnexion de l'utilisateur
export function logoutUser() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userFavorites");
    store.currentUser = null;
}

// Fonction pour mettre à jour le nom d'une collection dans les favoris
export function updateLocalCollectionName(id: string, newName: string) {
    if (store.currentUser) {
        store.currentUser.updateFavoriteName(id, newName);
        updateFavorites();
    }
}

// Fonction pour supprimer une collection de favoris
export function deleteLocalCollection(id: string) {
    if (store.currentUser) {
        store.currentUser.removeFavorite(id);
        updateFavorites();
    }
}

export function addFavorite(newList: any){
    if(store.currentUser){
        store.currentUser.addFavorite(newList);
        updateFavorites();
    }
}

// Exports des données
export const user = store.currentUser;
export const restaurants = store.restaurantsList;
export const userCollections = user?.favorites
