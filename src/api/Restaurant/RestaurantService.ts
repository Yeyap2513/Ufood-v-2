  import RequestBuilder from "../RequestBuilder/RequestBuilder";
import { RestaurantPoco } from "@/pocos/RestaurantPoco";
import { mapJsonIntoVisit, mapRestaurant } from "@/utils/Mappers";
import { Headers } from "../RequestBuilder/Headers";
import { VisitPoco } from "@/pocos/VisitPoco";

export async function getRestaurants(): Promise<RestaurantPoco[]> {
    const response = await new RequestBuilder()
        .get('restaurants')
        .unsecure(true)
        .send();

    const restaurants: Array<RestaurantPoco> = [];    

    if(Array.isArray(response.items)) {
        response.items.forEach((restaurant: any) => {
            restaurants.push(mapRestaurant(restaurant));
        })
    }

    return restaurants;
}

export async function getRestaurant(id: string): Promise<RestaurantPoco> {
    const response = await new RequestBuilder()
        .get(`restaurants/${id}`)
        .unsecure(true)
        .send();

    return mapRestaurant(response);
}

export interface VisitFormPayload {
    restaurant_id: string,
    comment: string,
    rating: number,
    date: Date
}

export async function rateRestaurant(userId: string, payload: VisitFormPayload): Promise<VisitPoco> {
    const response = await new RequestBuilder()
        .post(`users/${userId}/restaurants/visits`)
        .header(Headers.JSON)
        .body(payload)
        .unsecure(true)
        .send();

    const visit = mapJsonIntoVisit(response);

    return visit;
}

//modal restoService
export async function createCollection(owner: string, name:string){
    const response = await new RequestBuilder()
        .post("favorites")
        .header(Headers.JSON)
        .body({
            name:name,
            owner: owner,
        })
        .unsecure(true)
        .send();
}

export async function addRestoCollection(restoId: string, collection:string){
    const response = await new RequestBuilder()
        .post(`favorites/${collection}/restaurants`)
        .header(Headers.JSON)
        .body({
            id: restoId,
        })
        .unsecure(true)
        .send();
}