<template>
  <div>
      <div class="container" id="collectionRibbon">
          <div class="row">
            <div class="col-4 d-flex flex-wrap">
              <div v-for="(resto, index) in restaurants.slice(0, 4)" :key="index" class="col-6">
                <div style="height: 20vh;"><img class="img-fluid h-100" :src="resto.pictures[0]" alt="Restaurant image" /></div>
              </div>
            </div>
              <div class="col-md-7 col-12" id="ribbon_infos">
                <p>collection</p>
                  <div id="collection_name">
                      <h1 v-if="collection?.name">
                          {{collection.name ? collection.name: "No name" }}
                      </h1>
                      <h1 v-else>
                          No name
                      </h1>
                  </div>
                  <div id="collection_details">
                      <div class="row" v-if="collection?.owner">
                          <h4>{{ collection.owner.name ? collection.owner.name: 'No Owner' }}</h4>
                          <p>{{ collection.restaurants.length }} elements</p>
                      </div>  
                  </div>
              </div>
          </div>
      </div>
      <div class="container" id="resto_collection_list">
          <TableauFavoris :restaurants="restaurants" :collection-id="collectionId" @restoDeleted="handleRestoDeleted" />
      </div>
  </div>
</template>

<script lang="ts">
import { getFavoriteById, getRestaurant } from '@/api/api';
import TableauFavoris from '@/components/favoris/TableauFavoris.vue';
import { defineComponent } from 'vue'

interface Owner {
id: string;
name: string | "";
email?: string;
}
interface Resto {
id: string | '';
}
interface ListeFavoriteProps {
id: string;
name?: string;
owner: Owner;
restaurants: Resto[];
}


export default defineComponent({
components: {
  TableauFavoris,
},
data() {
  return {
    collection: {} as ListeFavoriteProps | null,
    restaurants: [] as any,
    collectionId: "",
  };
},
methods: {
  async getCollectionInfos(collectionId: string) {
    try {
      this.collectionId = collectionId;
      const data = await getFavoriteById(collectionId);
      this.collection = data;
      // Call getRestoInfos after collection data is set
      if (this.collection?.restaurants) {
        this.getRestoInfos(this.collection.restaurants);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de collection:', error);
    }
  },
  async getRestoInfos(restos: { id: string }[]) {
    try {
      const tempArray = [];
      for (const resto of restos) {
        const data = await getRestaurant(resto.id);
        tempArray.push(data);
      }
      this.restaurants = tempArray;
    } catch (e) {
      console.error('An error occurred:', e);
    }
  },
  async handleRestoDeleted(restoId: string) {
    this.restaurants = this.restaurants.filter((resto: Resto) => resto.id !== restoId);
},
},
mounted() {
  const collectionId = this.$route.params.id as string;
  this.getCollectionInfos(collectionId);
},
});
</script>


<style scoped>

</style>