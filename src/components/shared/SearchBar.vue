<template>
    <div v-if="isSearchBarActive" class="search-bar" ref="searchBar">
        <div class="input-group">
            <input type="text" v-model="searchQuery" @input="handleInput" @focus="clearTimeoutAndShowSuggestions"
                @blur="hideSuggestionsAfterDelay" class="form-control me-2" placeholder="Find a restaurant..." />
            <button v-if="mode === 'navigate'" @click="goToRestaurant" class="btn btn-outline-success">Go</button>
        </div>
        <!-- Menu déroulant pour les suggestions -->
        <ul v-if="mode === 'navigate' && filteredRestaurants.length && searchQuery" class="list-group position-absolute"
            @mouseleave="hideSuggestionsAfterDelay">
            <li v-for="restaurant in filteredRestaurants" :key="restaurant.id" @click="selectRestaurant(restaurant)"
                class="list-group-item list-group-item-action">
                {{ restaurant.name }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { RestaurantPoco } from '@/pocos/RestaurantPoco';
import { restaurants } from '@/store/store';
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        mode: {
            type: String,
            required: true,
            validator: (value: string) => ['filter', 'navigate'].includes(value),
        }
    },
    data() {
        return {
            searchQuery: '',
            restaurants: [] as Array<RestaurantPoco>,
            filteredRestaurants: [] as Array<RestaurantPoco>,
            selectedRestaurant: null as RestaurantPoco | null,
            timeoutId: null as number | null // ID pour le setTimeout
        };
    },
    computed: {
        isSearchBarActive(): boolean {
            return !(this.mode === 'navigate' && this.$route.path === '/');
        },
    },
    methods: {
        handleInput() {
            if (this.mode === 'filter') {
                this.$emit('filter-query', this.searchQuery);
            }
            if (this.mode === 'navigate') {
                this.filteredRestaurants = this.restaurants.filter(restaurant =>
                    restaurant.name.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
        },
        selectRestaurant(restaurant: RestaurantPoco) {
            this.selectedRestaurant = restaurant;
            this.searchQuery = restaurant.name;
            this.filteredRestaurants = [];
        },
        goToRestaurant(): void {
            if (this.selectedRestaurant) {
                this.$router.push({ name: 'Restaurant', params: { id: String(this.selectedRestaurant.id) } });
                this.searchQuery = '';
                this.selectedRestaurant = null;
            } else {
                alert("Veuillez sélectionner un restaurant.");
            }
        },
        clearTimeoutAndShowSuggestions() {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
            // Afficher les suggestions
            this.filteredRestaurants = this.restaurants.filter(restaurant =>
                restaurant.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        hideSuggestionsAfterDelay() {
            // Masquer les suggestions après 5 secondes
            this.timeoutId = window.setTimeout(() => {
                this.filteredRestaurants = [];
                if (this.mode === 'navigate') {
                    this.searchQuery = ''
                }
            }, 5000);
        }
    },
    async mounted() {
        this.restaurants = restaurants;
    },
    beforeUnmount() {
        if (this.timeoutId) clearTimeout(this.timeoutId);
    }
});
</script>

<style scoped>
.search-bar {
    display: flex;
    align-items: center;
    position: relative;
}

.list-group {
    z-index: 1000;
    top: 50px;
}
</style>
