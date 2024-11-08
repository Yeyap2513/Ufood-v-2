<template>
  <div class="container">
    <v-card class="mx-auto" max-width="600">
      <div class="d-flex align-items-center justify-content-center">
        <v-btn rounded="xl" size="large">Create Collection</v-btn>
      </div>
      <v-container class="pa-8" style="height:50vh; overflow-y: scroll;">
        <v-item-group v-model="localSelection" multiple>
          <v-row>
            <v-col v-for="(item, i) in items" :key="i" cols="12" md="4">
              <v-item v-slot="{ isSelected, toggle }">
                <div v-if="item.restaurants && item.restaurants.length > 0">
                  <v-img
                    :src="images[item.restaurants[0].id] || fallbackImage"
                    class="text-right pa-2"
                    height="200"
                    cover
                    @click="toggle"
                  >
                    <v-btn :icon="isSelected ? 'mdi-check' : 'mdi-plus'"></v-btn>
                  </v-img>
                </div>
                <div v-else>
                  <v-img
                    :src="fallbackImage"
                    class="text-right pa-2"
                    height="200"
                    cover
                    @click="toggle"
                  >
                    No restaurant image
                    <v-btn :icon="isSelected ? 'bi bi-check-lg' : 'bi bi-plus-lg'"></v-btn>
                  </v-img>
                </div>
              </v-item>
              {{ item.name }}
            </v-col>
          </v-row>
        </v-item-group>
      </v-container>
    </v-card>
    <div class="row justify-content-end modal-footer">
      <span class="col-3">
        <v-btn color="secondary" class="full-width" @click="closeModal">Close</v-btn>
      </span>
      <span class="col-3">
        <v-btn color="primary" class="full-width" @click="submitForm">Submit</v-btn>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { getRestaurant } from '@/api/api';
import { addRestoCollection } from '@/api/Restaurant/RestaurantService';
import { listeFavoritePoco } from '@/pocos/ListeFavoritePoco';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AddRestoModal',
  props: {
    restoId:{
      type: String,
      required: false,
      default: "",
    },
    items: {
      type: Array as () => listeFavoritePoco[],
      required: false,
      default: () => [],
    },
    selection: {
      type: Array as () => number[],
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      localSelection: this.selection,
      images: {} as Record<string, string>,
      fallbackImage: '',
    };
  },
  mounted() {
    this.loadImages(this.items);
  },
  watch: {
    items: {
      immediate: true,
      handler(newItems) {
        this.loadImages(newItems);
      },
    },
  },
  methods: {
    async loadImages(items: listeFavoritePoco[]) {
      for (let item of items) {
        if (item.restaurants && item.restaurants.length > 0) {
          const restaurantId = item.restaurants[0].id;
          try {
            const restaurant = await getRestaurant(restaurantId);
            this.images[restaurantId] = restaurant.pictures[0];
          } catch (e) {
            console.error("Erreur lors du chargement de l'image du restaurant:", e);
          }
        }
      }
    },
    async addSelectedToCollection() {
      console.log(this.localSelection);
      try {
        for (const index of this.localSelection) {
          const response = await addRestoCollection(this.restoId, this.items[index].id);
          console.log("okayyy", response);
        }
        console.log("All selected items added to the collection successfully!");
      } catch (error) {
        console.error("Error adding items to the collection:", error);
      }
    },
    closeModal() {
      this.$emit("close");
    },
    async submitForm() {
      try {
        await this.addSelectedToCollection();
        this.$emit('submit');
      } catch (e) {
        console.log(e);
      }
    },
  },
  emits: ['submit', 'close'],
});
</script>
