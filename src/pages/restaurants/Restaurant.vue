<template>
  <div style="margin-bottom: 15vh;">
    <section id="ribbon">
        <RestoRibbon :resto="resto"/>
      </section>

      <div class="container d-flex justify-content-center">
      <div class="row">
        <div class="col-md-8 col-12">
          <section id="type">
            <div class="container">
              <div class="row d-flex" style="gap: 1vw;">
                <div v-for="(type, index) in resto.genres" :key="index" class="col-md-4 col-9 type_value">
                  <i class="bi bi-search type_search_icon"></i>
                  <p>{{ type }}</p>
                </div>
              </div>
            </div>
          </section>

          <hr />

          <section id="posts">
            <h3>Posts</h3>
            <div class="container">
              <div id="posts_container" style="height: 80vh; overflow: scroll;">
                <div class="row">
                  <div v-for="(image, index) in resto.pictures" :key=index class="col-12 col-lg-6 mb-4" id="post_img_container"  ><img :src="image" class="w-100 rounded" style="height: 40vh; object-fit: cover"></div>
                </div>
              </div>
            </div>
          </section>

          <hr />

          <section id="location_schedule" class="container text-lg-start text-center">
            <h3>Location & Schedule</h3>
            <div id="location_schedule_container" class="row">
              <div id="small_map_container" class="col-lg-7 col-12">
                <div class="card">
                  <div class="card-body">
                    <RestaurantMap 
                      :latitude="resto.location?.coordinates[1]" 
                      :longitude="resto.location?.coordinates[0]" 
                      :name="resto.name"
                    />
                  </div>
                </div>
              </div>
  <!---------------------------------------- schedule --------------------------------->
              <div id="schedule_container" class="col-lg-5 col-12" >
                <Schedule :resto-hours="resto.opening_hours"/>
              </div>
            </div>
          </section>
        </div>

        <section class="col-md-4 d-md-block d-none">
          <div class="sticky-top fixed-sm" id="infos_important">
            <h5>Informations {{ resto.name }}</h5>
            <div>
              <div class="row"><i class="bi bi-telephone-fill col-2" style="font-size: 25px;"></i><p class="col-10 mt-2"><a :href="`tel:${resto.tel}`">{{ resto.tel }}</a></p></div>
              <hr />
              <div class="row"><i class="bi bi-geo-alt-fill col-2"></i><p class="col-10"><a href="#location_schedule">{{resto.address}}</a></p></div>
              <hr />
              <div class="row add_collection_button" @click="openModal('add_resto', restoId)"><i type="button" class="bi bi-heart-fill col-2" style="font-size: 2rem;"></i><div class="col-10 mt-2"><p>Add To collection</p></div></div>
            </div>
          </div>
        </section>

        <section class="col-md-4 d-md-none">
          <div class="fixed-bottom" id="infos_important_cell">
            <div>
              <div class="row"><i class="bi bi-telephone-fill col-2" style="font-size: 25px;"></i><p class="col-10 mt-2"><a :href="`tel:${resto.tel}`">{{ resto.tel }}</a></p></div>
              <div class="row"><i class="bi bi-geo-alt-fill col-2"></i><p class="col-10"><a href="#location_schedule">{{resto.address}}</a></p></div>
              <div class="row add_collection_button"  @click="openModal('add_resto', restoId)"><i type="button" class="bi bi-heart-fill col-2" style="font-size: 2rem;"></i><div class="col-10 mt-2"><p>Add To collection</p></div></div>
            </div>
          </div>
        </section>
        <modal-component ref="addRestoPopup" :id="'add_resto_popup'" :labeled-by="'popupTest'" :title="'Add'">
              <AddRestoModal1 :resto-id="currentRestaurantId" :items="user_collections" @close="closeModal('add_resto')" v-on:submit="submitForm('add_resto')"></AddRestoModal1>
        </modal-component>

      </div>
    </div>
  </div>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { getRestaurant } from '@/api/api';
import RestoRibbon from '@/components/ribbon/RestoRibbon.vue';
import Schedule from './Schedule.vue';
import RestaurantMap from '@/components/shared/RestaurantMap.vue';
import ModalComponent from '@/components/shared/ModalComponent.vue';
import { userCollections } from '@/store/store';
import AddRestoModal1 from '@/components/favoris/AddRestoModal.vue';

interface OpeningHours {
  [day: string]: string;
}

interface Restaurant {
  id: string;
  opening_hours: OpeningHours;
  pictures: string[];
  name: string;
  place_id: string;
  tel: string;
  address: string;
  price_range: number;
  rating: number;
  genres: string[];
  location: {
    coordinates: [number, number];
    type: string;
  };
}
export default defineComponent({
  components: {
    RestaurantMap,
    RestoRibbon,
    Schedule,
    ModalComponent,
    AddRestoModal1,
  },
  
  data() {
    return {
      currentRestaurantId: '',
      slidesPerView: 3,
      resto: {} as Restaurant,
      swiper: null as any,
      directionsService: null as any, 
      directionsRenderer: null as any,
      user_collections: userCollections,
      restoId: "",
    };
  },
  methods: {
    async getResto(restoId: string) {
      this.restoId = restoId;
      const resto = await getRestaurant(restoId);
      this.resto = resto;
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
        }
  },
  mounted() {
    this.getResto(this.$route.params.id as string);
  },
  beforeDestroy() {
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.getResto(this.$route.params.id as string);
      },
      immediate: true,
    },
  },
});
</script>

<style src="./restaurant_page.css"></style>

