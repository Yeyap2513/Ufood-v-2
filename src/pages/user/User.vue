<template>
  <div class="container" v-if="isLoggedIn">
    <!-- Profil et informations de l'utilisateur -->
    <div class="d-flex justify-content-center mt-3 mb-5">
        <img
          :src="profile_pic"
          alt="Profile Picture"
          class="img-fluid rounded-circle profile-picture"
        />
    </div>
    <div class="row mb-2">
      <div class="col-md-9 d-flex flex-column" style="margin-left: 40px;">
        <h1 class="display-4 mb-5" style="font-weight: bold; font-size: 40px;">{{ store.currentUser.name ? store.currentUser.name.replace(/["']/g, ''):'No User' }}</h1>
        <p class="infos" style="font-size: 20px;">Email: {{ store.currentUser.email ? store.currentUser.email.replace(/["']/g, ''): 'No email' }}</p>
        <p class="infos" style="font-size: 20px;">Score: {{ store.currentUser.rating || 0 }}</p>
        <div class="mt-3">
          <button type="button" class="btn btn-success" id="btn-profile" style="width: auto;">Edit Profile</button>
        </div>
        <!-- Button to create a new favorite list -->
        <div class="mt-2">
          <button type="button" class="btn btn-primary" @click="openFavoriteListModal" id="btn-profile" style="width: auto;">Create a new List</button>
        </div>
        
        <div v-if="errorMessage" class="alert alert">
          {{ errorMessage }}
        </div>
          
        <div class="mt-2">
          <p class="lead fs-7" style="font-weight: bold;">Visits & Favorites</p>
        </div>
        
      </div>
    </div>

    <!-- Tabs -->
    <v-card>
      <v-tabs v-model="tab" bg-color="black" align-tabs="center">
        <v-tab value="visits">visits</v-tab>
        <v-tab value="collections">Collections</v-tab>
      </v-tabs>

      <v-card-text id="user_tab">
        <v-tabs-window v-model="tab" class="d-flex justify-content-center align-items-center">
          <v-tabs-window-item value="visits" v-if="tab == 'visits'">
            <UserRestaurant :model="visits"/>
          </v-tabs-window-item>

          <v-tabs-window-item value="collections" class="d-flex justify-content-center align-items-center" v-if="tab == 'collections'">
            <UserCollection :collections="user_collections" :images="images"
                            @updateCollection="handleCollectionUpdate"
                            @deleteCollection="handleCollectionDelete" />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>

    <!-- Modal pour la création de la liste -->
    <modal-component ref="favoriteListPopup" :id="'favorite_list_popup'" :labeled-by="'favoriteListPopupLabel'" :title="'Create a new List'">
      <CreateFavoriteListForm :userId="store.currentUser.id" :ownerEmail="store.currentUser.email"
                              @close="closeFavoriteListModal"
                              @submit="addFavoriteList"/>
    </modal-component>
  </div>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue';
import { getVisitsByUser } from '@/api/user/UserService';
import { addFavorite, deleteLocalCollection, store, updateLocalCollectionName, user, userCollections } from '@/store/store';
import { VisitPoco } from '@/pocos/VisitPoco';
import UserRestaurant from './UserRestaurant.vue';
import UserCollection from './UserCollection.vue';
import CreateFavoriteListForm from '@/components/favoris/CreateFavoriteListForm.vue';
import ModalComponent from '@/components/shared/ModalComponent.vue';
import { getRestaurant } from '@/api/Restaurant/RestaurantService';
import { listeFavoritePoco } from '@/pocos/ListeFavoritePoco';


export default defineComponent({
  data() {
    return {
      store: store as any,
      username: "Quandale Dingle",
      phone: '(555) 555-5555',
      address: '750 Rue de la Mer',
      profile_pic: "https://i.postimg.cc/yYQyLzbj/UFOOD-removebg-preview-ezgif-com-crop.png",

      user: user,
      restaurant: [],
      enrichedData: [],
      isFavoriteModalVisible: false,  
      editingListId: null, 
      errorMessage: "", 
      editedListName: "",
      visits: [] as Array<VisitPoco>,
      tab: ref("visits"),
      images: {} as Record<string, string>,
    };
  },
  components: {
    UserRestaurant,
    UserCollection,
    CreateFavoriteListForm,
    ModalComponent,
  },

  computed: {
    isLoggedIn() {
      return !!store.currentUser;
    },
    user_collections() {
      return store.currentUser?.favorites || [];
    }
  },

  mounted(){
    if(store.currentUser){
      this.fetchData()
    }
    else{
      this.$router.push('/');
    }
  },

  methods: {
    openFavoriteListModal() {
      (this.$refs.favoriteListPopup as typeof ModalComponent).openModal();
    },
    closeFavoriteListModal() {
      (this.$refs.favoriteListPopup as typeof ModalComponent).closeModal();
    },
    handleCollectionUpdate({ id, name }: any) {
      updateLocalCollectionName(id, name);
    },
    handleCollectionDelete(id: string) {
      deleteLocalCollection(id);
    },
    addFavoriteList(newList : any) {
      addFavorite(newList);
    },
    async fetchData() {
      try {
        if (this.isLoggedIn){
          this.visits = await getVisitsByUser(this.store.currentUser.id);
          this.user_collections = userCollections || [];
          await this.loadImages(this.user_collections);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    },
    async loadImages(collections: listeFavoritePoco[]) {
      for (let collection of collections) {
        const restaurantId = collection.restaurants[0]?.id;
        if (restaurantId) {
          try {
            const restaurant = await getRestaurant(restaurantId);
            if (restaurant?.pictures?.length) {
              this.images[restaurantId] = restaurant.pictures[0];
            }
          } catch (e) {
            console.error("Erreur lors du chargement de l'image du restaurant:", e);
          }
        }
      }
    },
    groupRestaurants(restaurants: any) {
      const idCounts: any = {};

      restaurants.forEach((element:any) => {
        const id = element.restaurant_id;
        if (idCounts[id]) {
          idCounts[id].count += 1;
        } else {
          idCounts[id] = {
            count: 1,
          };
        }
      });

      return Object.keys(idCounts).map(id => ({
        restaurant_id: id,
        count: idCounts[id].count,
      }));
    },
    async addImgNom(result: any) {
      const final = [];

      for (const element of result) {
        try {
          const data = await getRestaurant(element.restaurant_id);
          final.push({
            restaurant_id: element.restaurant_id,
            name: data.name,
            image: data.pictures[0],
            count: element.count,
          });
        } catch (error) {
          console.error(`Erreur lors de la récupération des données du restaurant ${element.restaurant_id}:`, error);
        }
      }

      return final;
    }
  }

  },
);
</script>


<style src="./user.css" scoped>

</style>

