<template>
  <div class="container user-collection-container">
    <div class="row">
      <div class="d-flex justify-content-around mt-3 mb-5" v-if="collections.length === 0">
        <div>You Don't have any favorites collection.</div>
        <button class="btn-return" @click="createCollection">Create collection (bouton non implanté)</button>
      </div>
      <div v-else class="row d-flex justify-content-center align-items-center">
        <CollectionCard
          v-for="(collection, index) in collections"
          :key="index"
          :collection="collection"
          :image="images[collection.restaurants[0]?.id] || fallbackImage"
          :mode="'real'"
          @updateCollectionName="handleUpdateCollectionName"
          @collectionDeleted="handleCollectionDeleted"
          class="col-12 col-md-4 m-1"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import CollectionCard from './CollectionCard.vue';
import { listeFavoritePoco } from '@/pocos/ListeFavoritePoco';

export default defineComponent({
  name: "UserCollection",
  props: {
    collections: {
      type: Array as PropType<listeFavoritePoco[]>,
      required: true
    },
    images: {
      type: Object as PropType<Record<string, string>>,
      required: true
    },
  },
  data() {
    return {
      fallbackImage: 'https://via.placeholder.com/150',
    };
  },
  components: {
    CollectionCard,
  },
  methods: {
    createCollection() {
      this.$emit('createCollection');
    },
    handleUpdateCollectionName({ id, name }: any) {
      this.$emit('updateCollection', { id, name });
    },
    handleCollectionDeleted(id: string) {
      this.$emit('deleteCollection', id);
    },
  }
});
</script>

<style>
.user-collection-container {
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
}</style>