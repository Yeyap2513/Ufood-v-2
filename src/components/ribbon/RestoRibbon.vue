<template>
    <div>
        <div id="ribbon_container" style="height:fit-content;">
          <div id="ribbon_carousel" class="carousel slide">
            <div class="carousel-inner" style="display: flex;">
              <swiper :slides-per-view="slidesPerView" :space-between="0" :pagination="{ clickable: true }" @swiper="onSwiper" @slideChange="onSlideChange">
                <swiper-slide v-for="(image, index) in resto.pictures" :key="index" >
                  <div id="carousel_img_container"><img :src="image" class=" d-block w-100" alt="Restaurant Image" style="height: 50vh; object-fit: cover;"></div>
                </swiper-slide>
              </swiper>
              <button @click="swiper.slidePrev()" class="carousel-control-prev"><span class="carousel-control-prev-icon"></span></button>
              <button @click="swiper.slideNext()" class="carousel-control-next"><span class="carousel-control-next-icon"></span></button>
            </div>
          </div>
          <div class="row text-center" id="resto_infos">
            <div class="col">
              <h1>{{ resto.name }}</h1>
              <div class="d-flex justify-content-center" >
                <span v-for="(i) in 5" :key="i" id="star" >
                  <i class="bi bi-star-fill"></i>
                  <span class="filled" :style="{width: getStarWidth(i, resto.rating) + '%',}" >
                    <i class="bi bi-star-fill"></i>
                  </span>
                </span>
              </div>
              <div id="resto_status" >
                <div v-if="getRestaurantStatus(resto)" class="d-inline-flex align-items-center gap-2">
                  <span id="open_resto"></span>
                  <p class="mb-0">Open</p>
                </div>
                <div v-else class="d-inline-flex align-items-center gap-2">
                  <span id="closed_resto"></span>
                  <p class="mb-0">Closed</p></div>
                </div>
              <div>{{ '$'.repeat(resto.price_range) }}</div>
            </div>
          </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/autoplay';

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
    name: "RestoRibbon",
    props:{
        resto:{ 
            type: {} as () =>  Restaurant,
            required: false,
            default: {},
        },
    },

    components: {
        Swiper,
        SwiperSlide,
    },

    data() {
        return {
        slidesPerView: 3,
        swiper: null as any, 
        };
    },
    methods:{
        onSwiper(swiperInstance: any) {
            this.swiper = swiperInstance;
            console.log('Swiper initialized', swiperInstance);
        },
        
        onSlideChange() {
            console.log('Slide changed');
        },
        
        slideNext() {
            if (this.swiper) {
                this.swiper.slideNext();
            }
        },
        
        slidePrev() {
            if (this.swiper) {
                this.swiper.slidePrev();
            }
        },
        getSlidesPerView(): number {
            return window.innerWidth > 768 ? 3 : 1;
        },
        onResize() {
            this.slidesPerView = this.getSlidesPerView();
        },
        getStarWidth(index: number, rating: number): number {
        const completeStar = index;
        if (rating >= completeStar) {
            return 100;
        } else if (rating >= completeStar - 1 && rating < completeStar) {
            return (rating - (completeStar - 1)) * 100;
        }
        return 0;
        },
        getRestaurantStatus(res: any): boolean {
            const weekDay = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const now = new Date();
            const currentDay = now.getDay();
            const currentHour = now.getHours();
            
            const openHours = res?.opening_hours?.[weekDay[currentDay]];

            if (!openHours) {
                return false;
            }

            const [openingTime, closingTime] = openHours.split("-");
            const openingHour = openingTime.substring(0, 2);
            const closingHour = (closingTime.substring(0, 2) == "00") ? "24": closingTime.substring(0, 2);

            return currentHour >= openingHour && currentHour < closingHour;
        },
    },
    mounted() {
        this.slidesPerView = this.getSlidesPerView();
        window.addEventListener('resize', this.onResize);

    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    }

})
</script>
<style>
    
</style>