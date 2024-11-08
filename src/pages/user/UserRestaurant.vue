<template>
  <div class="container user-restaurant-container">
      <div class="row">
          <div class="d-flex justify-content-around mt-3 mb-5" v-if="model.length === 0">
              <div>
                  You haven't visited any restaurants.
              </div>
              <button class="btn-return" @click="Home">Return to the Home Page</button>
          </div>
          <div v-else class="row d-flex justify-content-center align-items-center">
            <visit-card v-for="(visit, index) in model" :key="index" :visit="visit" @clicked="openVisitPopup(visit)" class="col-12 col-md-6 col-lg-3 m-1"/>
          </div>

          <modal-component ref="ratingPopup" :id="'popup'" :labeled-by="'popupTest'" :title="'Visited form'">
              <visited-form 
                :restaurant-id="currentVisit!.restaurantId"
                :visit-date="currentVisit!.date"
                :visit-rating="currentVisit!.rating"
                :visit-comment="currentVisit!.comment" 
                :is-readonly="true" 
                @submitted="closeModal"
                @closed="closeModal"/>
          </modal-component>
      </div>
  </div>
</template>


<script lang="ts">
import ModalComponent from '@/components/shared/ModalComponent.vue';
import VisitedForm from '@/components/shared/VisitedForm.vue';
import { VisitPoco } from '@/pocos/VisitPoco';
import { defineComponent } from 'vue';
import VisitCard from './VisitCard.vue';

export default defineComponent({
  name:"UserRestaurant",
  data() {
    return {
      currentVisit: null as VisitPoco | null
    }
  },
  props: {
    model: {
      type: Array<VisitPoco>,
      required: true
    }
  },
  methods: {
    Home() {
      this.$router.push('/');
    },
    openVisitPopup(visit: VisitPoco) {
        this.currentVisit = visit;
        (this.$refs.ratingPopup as typeof ModalComponent).openModal();
    },
    closeModal() {
      (this.$refs.ratingPopup as typeof ModalComponent).closeModal();
    },
  },
  components: {
    ModalComponent,
    VisitedForm,
    VisitCard
  }
});
</script>

<style scoped>
.user-restaurant-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

.btn-return {
    padding: 5px 20px;
    background-color: #E2850B;
    border-radius: 5px;
    color: white;
    border: none;
}

ul {
    margin-bottom: 150px;
}
</style>
