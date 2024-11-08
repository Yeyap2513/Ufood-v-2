// models/User.ts

import { listeFavoritePoco } from '@/pocos/ListeFavoritePoco';

export class User {
    id: string;
    email: string;
    name: string;
    favorites: listeFavoritePoco[];

    constructor(id: string, email: string, name: string, favorites: listeFavoritePoco[] = []) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.favorites = favorites;
    }

    // Méthode pour mettre à jour le nom de l'utilisateur
    updateName(newName: string): void {
        this.name = newName;
    }

    // Méthode pour mettre à jour les favoris
    updateFavoriteName(collectionId: string, newName: string): void {
        const collection = this.favorites.find(fav => fav.id === collectionId);
        if (collection) {
            collection.name = newName;
        }
    }

    // Méthode pour ajouter une nouvelle collection de favoris
    addFavorite(newFavorite: listeFavoritePoco): void {
        this.favorites.push(newFavorite);
    }

    // Méthode pour supprimer une collection de favoris
    removeFavorite(collectionId: string): void {
        this.favorites = this.favorites.filter(fav => fav.id !== collectionId);
    }

    // Méthode pour sauvegarder l'état actuel de l'utilisateur dans le localStorage
    saveToLocalStorage(): void {
        localStorage.setItem('currentUser', JSON.stringify(this));
        localStorage.setItem('userFavorites', JSON.stringify(this.favorites));
    }

    // Méthode pour charger l'utilisateur à partir du localStorage
    static loadFromLocalStorage(): User | null {
        const userData = localStorage.getItem('currentUser');
        const userFavorites = localStorage.getItem('userFavorites');
        
        if (userData) {
            const parsedUser = JSON.parse(userData);
            const parsedFavorites = userFavorites ? JSON.parse(userFavorites) : [];
            return new User(parsedUser.id, parsedUser.email, parsedUser.name, parsedFavorites);
        }

        return null;
    }
}
