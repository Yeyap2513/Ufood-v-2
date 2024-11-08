import RequestBuilder from "../RequestBuilder/RequestBuilder";
import { mapJsonIntoVisit } from "@/utils/Mappers";
import { VisitPoco } from "@/pocos/VisitPoco";

export async function getVisitsByUser(userId: string): Promise<Array<VisitPoco>> {
    const response = await new RequestBuilder()
        .get(`users/${userId}/restaurants/visits`)
        .unsecure(true)
        .send()
    
        const visits: Array<VisitPoco> = [];    

        if(Array.isArray(response.items)) {
            response.items.forEach((visit: any) => {
                visits.push(mapJsonIntoVisit(visit));
            })
        }
    
        return visits;
}

/**
 * Supprime une liste de favoris en utilisant son ID.
 * 
 * @param listId - ID de la liste de favoris à supprimer
 * @returns void
 */
export async function deleteFavoriteListAPI(listId: string): Promise<void> {
    const response = await new RequestBuilder()
        .delete(`favorites/${listId}`)
        .unsecure(true)
        .send();
}

/**
 * Met à jour le nom d'une liste de favoris.
 * 
 * @param listId - ID de la liste de favoris à mettre à jour
 * @param newName - Nouveau nom pour la liste de favoris
 * @returns void
 */
export async function updateFavoriteListAPI(listId: string, newName: string): Promise<void> {
    const response = await new RequestBuilder()
        .put(`favorites/${listId}`)
        .unsecure(true)
        .body({ name: newName })
        .send();
}
