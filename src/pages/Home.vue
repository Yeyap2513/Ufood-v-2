<template>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Ufood</h1>

        <!-- Search Bar -->
        <div class="col-md-6 col-lg-5 mx-auto mb-4">
            <SearchBar mode="filter" @filter-query="filterRestaurants" />
        </div>

        <!-- Filter Section -->
        <div class="row mb-5">
            <div class="col-md-6">
                <!-- Price Filter -->
                <label for="priceRange" class="form-label">Filter by price range:</label>
                <select v-model="selectedPrice" class="form-select">
                    <option value="all">All price ranges</option>
                    <option value="1">$</option>
                    <option value="2">$$</option>
                    <option value="3">$$$</option>
                </select>
            </div>

            <div class="col-md-6">
                <!-- Genre Filter -->
                <label for="genre" class="form-label">Filter by food type:</label>
                <select v-model="selectedGenre" class="form-select">
                    <option value="all">All types</option>
                    <option v-for="genre in genresLists" :key="genre">{{ genre }}</option>
                </select>
            </div>
        </div>

        <!-- Restaurant List -->
        <div class="row" v-if="matchedRestaurants.length">
            <div class="col-md-4 mb-4 " v-for="restaurant in matchedRestaurants" :key="restaurant.id">
                <div class="card text-center w-75 h-100 d-flex " id="resto_card">
                    <img :src="restaurant.pictures[0]" class="img-fluid w-100" id="card_img_top"
                        :alt="restaurant.name" />
                    <div class="card-body" id="resto_card_infos">
                        <h5 class="card-title">{{ restaurant.name }}</h5>
                        <p class="card-text">Type: {{ restaurant.genres.join(', ') }}</p>
                        <p class="card-text">Price range: {{ '$'.repeat(restaurant.priceRange) }}</p>

                        <router-link :to="`/restaurant/${restaurant.id}`" class="btn btn-primary" id="btn-go">Go to restaurant page</router-link>
                        <button type="button" class="btn btn-light" @click="openVisitPopup(restaurant.id)">Mark as visited</button>
                        <i type="button" class="bi bi-heart-fill ml-3 mt-1" @click="openModal('add_resto', restaurant.id)" style="font-size: 2rem; color: #F8BBD0;"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- When there is no matchs found -->
        <div class="row" v-else>
            <div class="col text-center">
                <p>No restaurants match the filters.</p>
            </div>
        </div>


        <modal-component ref="ratingPopup" :id="'popup'" :labeled-by="'popupTest'" :title="'Visited form'">
            <visited-form :restaurant-id="currentRestaurantId" @submitted="closeModal('visit')" @closed="closeModal('visit')"></visited-form>
        </modal-component>
        <modal-component ref="addRestoPopup" :id="'add_resto_popup'" :labeled-by="'popupTest'" :title="'Add'">
              <AddRestoModal :resto-id="currentRestaurantId" :items="user_collections" @close="closeModal('add_resto')" v-on:submit="submitForm('add_resto')"></AddRestoModal>
        </modal-component>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { getRestaurants } from '@/api/Restaurant/RestaurantService';
import ModalComponent from '@/components/shared/ModalComponent.vue';
import VisitedForm from '@/components/shared/VisitedForm.vue';
import { RestaurantPoco } from '@/pocos/RestaurantPoco';
import AddRestoModal from '@/components/favoris/AddRestoModal.vue';
import SearchBar from '@/components/shared/SearchBar.vue';
import { user, userCollections } from '@/store/store';

export default defineComponent({
    name: 'Home',
    components: {
        SearchBar,
        ModalComponent,
        VisitedForm,
        AddRestoModal
    },
    data() {
        return {
            searchQuery: '',
            selectedPrice: 'all',
            selectedGenre: 'all',
            restaurants: [] as Array<RestaurantPoco>,
            currentRestaurantId: '',
            genresLists: [] as Array<string>,
            user_collections: userCollections,
        };
    },
    methods: {
        openVisitPopup(restaurantId: string) {
            this.currentRestaurantId = restaurantId;
            (this.$refs.ratingPopup as typeof ModalComponent).openModal();
        },
        openModal(type: string, restoId: string = "") {
            if (type==="visited"){
                (this.$refs.ratingPopup as typeof ModalComponent).openModal();
            }
            if (type==="add_resto"){
                this.currentRestaurantId = restoId;
                (this.$refs.addRestoPopup as typeof ModalComponent).openModal();
            }
        },
        closeModal(type: string) {
            if (type === "add_resto") {
                (this.$refs.addRestoPopup as typeof ModalComponent).closeModal();
            }

            if(type === 'visit') {
                (this.$refs.ratingPopup as typeof ModalComponent).closeModal();
            }
        },
        submitForm(type: string) {
            if (type === "add_resto") {
                (this.$refs.addRestoPopup as typeof ModalComponent).submitForm();
            }
        },
        filterRestaurants(query: string) {
            this.searchQuery = query;
        }
    },
    computed: {
        matchedRestaurants(): Array<RestaurantPoco> {
            let filteredRestaurants: Array<RestaurantPoco> = this.restaurants;

            return filteredRestaurants.filter((restaurant: RestaurantPoco) => {
                const matchesSearch = restaurant.name
                    .toLowerCase()
                    .includes(this.searchQuery.toLowerCase());
                const matchesPrice =
                    this.selectedPrice === 'all' ||
                    restaurant.priceRange === parseInt(this.selectedPrice);
                const matchesGenre =
                    this.selectedGenre === 'all' ||
                    restaurant.genres.includes(this.selectedGenre);

                return matchesSearch && matchesPrice && matchesGenre;
            });
        },
    },
    async mounted() {
        this.restaurants = await getRestaurants();
        let genresSet = new Set<string>(); //Pour une liste des genres uniques

        this.restaurants.forEach((restaurant) => {
            restaurant.genres.forEach((genre) => {
                genresSet.add(genre);
            });
        });

        this.genresLists = Array.from(genresSet);
    }
    ,
});
</script>



<!-- Custum CSS -->
<style>
#resto_card_infos {
    background-color: rgb(0, 0, 0);
    color: white;
}


#resto_card {
    height: fit-content;
    width: fit-content;
    transition: all 0.4s ease;
}

#resto_card:hover {
    transform: scale(1.02);
}


#card_img_top {
    height: 30vh;
    object-fit: cover;
}

#btn-go {
    border: none;
    background-color: #E2850B;
}
</style>
