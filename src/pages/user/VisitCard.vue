<template>
    <div class="restaurant-item col-md-4">
        <div class="d-flex justify-content-center align-items-center flex-column">
            <div class="row">
                <div class="col-12">
                    <div class="restaurant-description d-flex justify-content-center align-items-center flex-column">
                        <h2 class="restaurant-title fs-6 fs-md-5">
                            {{ restaurant.name }}
                        </h2>
                        <span>{{ visit.date.toLocaleDateString() }}</span>
                        <span>{{ "⭐".repeat(visit.rating) }}</span>
                        <div class="restaurant-image-container w-100">
                            <img v-if="restaurant.pictures" :src="restaurant.pictures[0]" :alt="restaurant.name" class="restaurant-image w-100">
                        </div>
                        <button class="btn btn-dark flex-grow-1 mt-1" @click="openVisitPopup()">See rating</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.restaurant-item {
    margin-bottom: 30px;
    padding: 10px;
    background-color: white;
    border-radius: 15px;
    border: 2px solid #E2850B;
    box-shadow: 5px 5px 7px rgba(0, 0, 0, 0.3);
    height: auto;

}

.restaurant-description {
    text-align: center;
}

.restaurant-title {
    width: 100%;
    max-width: 100%;
    margin-bottom: 10px;
}

.restaurant-image-container {
    height: 200px;
    overflow: hidden;
}

.restaurant-image {
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
}
</style>


<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { getRestaurant } from './../../api/Restaurant/RestaurantService';
import { RestaurantPoco } from '@/pocos/RestaurantPoco';
import { VisitPoco } from '@/pocos/VisitPoco';

export default defineComponent({
  name: 'VisitedForm',
  data() {
      return {
          restaurant: {} as RestaurantPoco
      };
  },
  props: {
      visit: {
          type: Object as PropType<VisitPoco>,
          required: true
      },
  },
  methods: {
      openVisitPopup() {
          this.$emit('clicked');
      },
      async getRestaurant() {
          this.restaurant = await getRestaurant(this.visit.restaurantId);
      }
  },
  mounted() {
      this.getRestaurant();
  },
  emits: [
      'clicked',
  ]
});
</script>
